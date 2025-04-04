import { Router, Request, Response } from "express";
import { registerSchema } from "../validation/authValidation.js";
import { ZodError } from "zod";
import { formatError, renderEmailEjs } from "../helper.js";
import prisma from "../config/database.js";
import bcrypt from "bcrypt";
import { v4 as uuid4 } from "uuid";
import { emailQueue, emailQueueName } from "../jobs/EmailJob.js";

const router = Router();

// Regiter route
router.post("/register", async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const payload = registerSchema.parse(body);
    let user = await prisma.user.findUnique({
      where: { email: payload.email },
    });
    if (user) {
      res.status(422).json({
        errors: {
          email: "Email already exists. Try another one.",
        },
      });
    }

    // Encrypt the password
    const salt = await bcrypt.genSalt(10);
    payload.password = await bcrypt.hash(payload.password, salt);

    const token = await bcrypt.hash(uuid4(), salt);
    const url = `${process.env.APP_URL}/verify-email?email=${payload.email}&token=${token}`;
    const emailBody = await renderEmailEjs("email-verify", {
      name: payload.name,
      url,
    });

    // send email
    await emailQueue.add(emailQueueName, {
      to: payload.email,
      subject: "Versus Email Verification",
      body: emailBody,
    });

    await prisma.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        password: payload.password,
        email_verify_token: token,
      },
    });

    res.json({ message: "Please check your email for verification." });
  } catch (error) {
    console.log(error);

    if (error instanceof ZodError) {
      const errors = formatError(error);
      res.status(422).json({ message: "Invalid data", errors });
      return;
    }
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
    return;
  }
});

export default router;
