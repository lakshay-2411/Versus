import { Job, Queue, Worker } from "bullmq";
import { defaultQueueOptions, redisConnection } from "../config/queue";
import prisma from "../config/database";

export const votingQueueName = "votingQueue";

export const votingQueue = new Queue(votingQueueName, {
  connection: redisConnection,
  defaultJobOptions: {
    ...defaultQueueOptions,
    delay: 500,
  },
});

// Worker
export const queueWorker = new Worker(
  votingQueueName,
  async (job: Job) => {
    const data = job.data;
    await prisma.versusItem.update({
      where: {
        id: Number(data?.versusItemId),
      },
      data: {
        count: {
          increment: 1,
        },
      },
    });
  },
  {
    connection: redisConnection,
  }
);
