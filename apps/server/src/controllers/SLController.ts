import { Request } from "express";
import AppError from "../errors/appError";
import Location from "../models/Location";
import SL, { SLDefinition } from "../models/SL";
import Cache from "../services/cache";
import { isValidUrl } from "../utils";
import handleAsync from "../utils/handleAsync";
import { generateQrCode } from "../services/qrCode";
import cloudinary from "../services/cloudinary";

export default class SLController {
  /** create a post */
  static create = handleAsync(async (req, res) => {
    const userId = req.user._id.toString();
    const { url, customDomain, hasQR } = req.body;
    let name = req.body.name ? req.body.name.trim().toLowerCase() : null;

    if (!url) throw new AppError('Url is required', 400);
    if (!isValidUrl(url)) throw new AppError('Invalid url', 400);
    if (name && !SLController._isNameAvailable(name)) throw new AppError('Name has been taken', 400);

    if (!name) {
      name = Buffer.from(url).toString('base64');
    }

    let shortLink;
    if (customDomain) {
      shortLink = `${customDomain}/${name}`
    } else {
      shortLink = `${req.protocol}://${req.get('host')}/${name}`
    }

    const sl = await SL.create({ userId, name, url, shortLink, isCustom: !!customDomain });

    // Save to cache
    await Cache.set(`sl_${shortLink}`, sl.url, 60 * 1); // expires in 1 min

    res.status(200).json({
      status: 'success',
      data: sl
    });
  });

  /** get all post */
  static getAll = handleAsync(async (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const count = await SL.countDocuments({ userId: req.user._id });
    const total = Math.ceil(count / limit);
    const sls = await SL.find({ userId: req.user._id }).skip(skip).limit(limit);
    res.status(200).json({
      status: 'success',
      sls,
      page,
      total
    });
  });

  /** get a post */
  static getOne = handleAsync(async (req, res) => {
    const { name } = req.params;
    const userId = req.user._id;
    const sl = await SL.findOne({ name, userId });
    if (!sl) {
      return res.status(404).json({
        status: 'error',
        message: 'Link not found'
      });
    }

    res.status(200).json({
      status: 'success',
      sl
    });
  });

  /** update a post */
  static update = handleAsync(async (req, res) => {
    const { nameParams } = req.params;
    const userId = req.user._id;
    const { name, url } = req.body;

    const sl = await SL.findOne({ name: nameParams, userId });
    if (!sl) {
      throw new AppError('Link not found', 404)
    }

    if (url && !isValidUrl(url)) throw new AppError('Invalid url', 400);

    const updates = { name, url };
    Object.keys(updates).forEach(key => {
      if (updates[key]) {
        sl[key] = updates[key];
        if (key === "name") {
          sl.shortLink = `${req.protocol}://${req.get('host')}/${name}`
        }
      }
    });
    await sl.save();

    return res.status(200).json({
      status: 'success',
      sl
    });
  });

  /** delete a post */
  static delete = handleAsync(async (req, res) => {
    const { name } = req.params;
    const userId = req.user._id;
    const shortLink = `${req.protocol}://${req.get('host')}/${name}`;
    await SL.findOneAndDelete({ name, userId });
    await Location.deleteMany({ slName: name });
    await cloudinary.uploader.destroy(`scissors/qr/${name}`)
    await Cache.del(`sl_${shortLink}`);
    return res.status(200).json({
      status: 'success',
      message: 'All done!'
    });
  });

  static checkNameAvailability = handleAsync(async (req, res) => {
    const name = req.params.name.trim();
    const available = await SLController._isNameAvailable(name);
    return res.status(200).json({
      status: 'success',
      available
    });
  });

  static redirectSL = handleAsync(async (req, res) => {
    const name = req.params.name.trim();
    const shortLink = `${req.protocol}://${req.get('host')}/${name}`;

    const cachedUrl = await Cache.get(`sl_${shortLink}`);
    if (cachedUrl) {
      // increment visit in cache
      // await Cache.client.hIncrBy(`sl_${shortLink}_visits`, req.ip, 1);
      return res.redirect(cachedUrl);
    }

    const sl = await SL.findOne({ name });
    if (!sl) {
      throw new AppError('Link not found', 404);
    }

    await SLController._visit(name, req);
    sl.visits += 1;
    await sl.save();

    await Cache.set(`sl_${shortLink}`, sl.url, 60 * 1); // expires in 1 min
    res.redirect(sl.url);
  });

  static getStats = handleAsync(async (req, res) => {
    const userId = req.user._id;

    const slNames = await SL.find({ userId }).select('name');
    const slNamesArr = slNames.map(sl => sl.name);

    const visits = [], total = 0;

    return res.status(200).json({
      status: 'success',
      total,
      visits
    });
  });

  static getOneStat = handleAsync(async (req, res) => {
    const userId = req.user._id;
    const { name: slName } = req.params;

    // Check if slName exists
    const sl = await SL.findOne({ userId, name: slName });
    if (!sl) {
      throw new AppError('Link not found', 404);
    }

    const activities = await Location.aggregate([
      { $match: { slName } },
      {
        $group: {
          _id: {
            ip: "$ip",
            date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }
          },
          visits: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: "$_id.ip",
          timeline: {
            $push: {
              date: "$_id.date",
              visits: "$visits"
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          ip: "$_id",
          timeline: 1
        }
      },
      {
        $sort: {
          "timeline.date": 1
        }
      }
    ]);

    return res.status(200).json({
      status: 'success',
      activities
    });
  });

  static getQR = handleAsync(async (req, res) => {
    const userId = req.user._id;
    const { name } = req.params;

    const sl = await SL.findOne({ name, userId })
    if (!sl) {
      throw new AppError("Link not found", 404);
    }

    if (!sl.qrUrl) {
      const qrUrl = await SLController._getQRLink(sl.shortLink);
      if (!qrUrl) {
        throw new AppError("Something went wrong", 400);
      }

      sl.qrUrl = qrUrl;
      await sl.save();
    }

    return res.status(200).json({
      status: "success",
      sl
    })
  })

  private static _isNameAvailable = async (name: string) => {
    const sl = await SL.find({ name });
    return sl.length === 0;
  }

  private static _visit = async (slName: string, req: Request) => {
    const ip = req.ip, browser = req.headers['user-agent'];
    await Location.create({ slName, ip, browser });
  }

  private static _getQRLink = async (link: string) => {
    const name = link.split("/").slice(-1)[0]
    const dataUri = await generateQrCode(link)
    if (!dataUri) return null

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "scissors/qr",
      public_id: name
    })
    return result.secure_url
  }
}