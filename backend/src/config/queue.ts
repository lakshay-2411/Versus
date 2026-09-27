import { ConnectionOptions, DefaultJobOptions } from "bullmq";

export const redisConnection: ConnectionOptions = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD,
  tls: {},
  maxRetriesPerRequest: null,
};

export const defaultQueueOptions: DefaultJobOptions = {
  removeOnComplete: {
    count: 20,
    age: 60 * 60,
  },
  attempts: 3,
  backoff: {
    type: "exponential",
    delay: 3000,
  },
  removeOnFail: false,
};
