import { Request } from "express";
import AppError from "../errors/appError";
import Location from "../models/Location";
import SL from "../models/SL";
import Cache from "../services/cache";
import { isValidUrl } from "../utils";
import handleAsync from "../utils/handleAsync";

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
    await Cache.set(`sl_${shortLink}`, url);

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
    await SL.findOneAndDelete({ name, userId });
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
    const name = req.params.name.trim().toLowerCase();
    const shortLink = `${req.protocol}://${req.get('host')}/${name}`;

    const cachedUrl = await Cache.get(`sl_${shortLink}`);
    if (cachedUrl) {
      // Well, this kinda contradicts the purpose of caching; we're still hitting the db
      await SLController._visit(cachedUrl, req);
      return res.redirect(cachedUrl);
    }

    const sl = await SL.findOne({ name });
    if (!sl) {
      throw new AppError('Link not found', 404);
    }

    await SLController._visit(sl._id, req);
    await sl.save();
    res.redirect(sl.url);
  });

  static getStats = handleAsync(async (req, res) => {
    const userId = req.user._id;
    
    // Get total visits
    const totalVisits = await Location.aggregate([
      { $match: { userId } },
      { $group: { _id: null, total: { $sum: "$visits" } } }
    ]);

    // Group by slId
    const visits = await Location.aggregate([
      { $match: { userId } },
      { $group: { _id: "$slId", total: { $sum: "$visits" } } }
    ]);

    return res.status(200).json({
      status: 'success',
      totalVisits: totalVisits[0]?.total || 0,
      visits
    });
  });

  private static _isNameAvailable = async (name: string) => {
    const sl = await SL.find({ name });
    return sl.length === 0;
  }

  private static _visit = async (slId: string, req: Request) => {
    const ip = req.ip, browser = req.headers['user-agent'];
    const location = await Location.findOne({ slId, ip, browser });
    if (!location) {
      await Location.create({ slId, ip, browser });
    } else {
      location.visits += 1;
      await location.save();
    }
  }
}