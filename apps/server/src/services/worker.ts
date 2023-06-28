import { Queue, Worker, Job } from "bullmq";

const qrQueue = new Queue("QR");

type QRJobData = {
  url: string;
  slId: string;
  userId: string;
};

type QRJobReturnData = {
  slId: string;
  userId: string;
  qrUrl: string;
}

// worker
const qrWorker = new Worker<QRJobData, QRJobReturnData>("QR", async (job) => {
  const { slId, userId } = job.data;
  // generate qr code and upload to cloudinary
  return {
    slId,
    userId,
    qrUrl: "https://res.cloudinary.com/dk9fdcnnp/image/upload/v1623777939/qr-code.png"
  }
});

qrWorker.on("completed", (job) => { 
  const { slId, userId, qrUrl } = job.returnvalue;
  // save url to db
  console.log(`Job with id ${job.id} has been completed`);
});