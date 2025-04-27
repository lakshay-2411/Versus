import { Job, Queue, Worker } from "bullmq";
import { defaultQueueOptions, redisConnection } from "../config/queue";
import prisma from "../config/database";

export const commentQueueName = "commetQueue";

export const commentQueue = new Queue(commentQueueName, {
  connection: redisConnection,
  defaultJobOptions: {
    ...defaultQueueOptions,
    delay: 1000,
  },
});

// Worker
export const queueWorker = new Worker(
  commentQueueName,
  async (job: Job) => {
    const data = job.data;
    await prisma.versusComments.create({
      data: {
        comment: data?.comment,
        clash_Id: Number(data?.id),
      },
    });
  },
  {
    connection: redisConnection,
  }
);
