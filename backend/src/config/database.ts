import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === "production" ? ["error"] : ["error", "query"],
  errorFormat: "pretty",
});

export default prisma;
