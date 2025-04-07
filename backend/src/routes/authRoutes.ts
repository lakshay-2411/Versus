import { Router, Request, Response } from "express";
import { loginSchema, registerSchema } from "../validation/authValidation";
import { ZodError } from "zod";
import { formatError, renderEmailEjs } from "../helper";
import prisma from "../config/database";
import bcrypt from "bcrypt";
import { v4 as uuid4 } from "uuid";
import jwt from "jsonwebtoken";
import { emailQueue, emailQueueName } from "../jobs/EmailJob";
import authMiddleware from "../middleware/AuthMiddleware";
import { authLimiter } from "../config/rateLimit";

const router = Router();

// Login route
router.post("/login", authLimiter, async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const payload = loginSchema.parse(body);
    let user = await prisma.user.findUnique({
      where: { email: payload.email },
    });
    if (!user || user === null) {
      res.status(422).json({
        errors: {
          email: "No user found with this email.",
        },
      });
      return;
    }
    // Check if the password is correct
    const compare = await bcrypt.compare(payload.password, user?.password);
    if (!compare) {
      res.status(422).json({
        errors: {
          email: "Invalid email or password.",
        },
      });
      return;
    }

    // JWT payload
    let JWTPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
    };
    const token = jwt.sign(JWTPayload, process.env.SECRET_KEY!, {
      expiresIn: "365d",
    });
    res.json({
      message: "Logged in successfully.",
      data: {
        ...JWTPayload,
        token: `Bearer ${token}`,
      },
    });
  } catch (error) {
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

// Login check route for credentials checkinh
router.post(
  "/check/credentials",
  authLimiter,
  async (req: Request, res: Response) => {
    try {
      const body = req.body;
      const payload = loginSchema.parse(body);
      let user = await prisma.user.findUnique({
        where: { email: payload.email },
      });
      if (!user || user === null) {
        res.status(422).json({
          errors: {
            email: "No user found with this email.",
          },
        });
        return;
      }
      // Check if the password is correct
      const compare = await bcrypt.compare(payload.password, user?.password);
      if (!compare) {
        res.status(422).json({
          errors: {
            email: "Invalid email or password.",
          },
        });
        return;
      }

      res.json({
        message: "Logged in successfully.",
        data: {},
      });
    } catch (error) {
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
  }
);

// Regiter route
router.post("/register", authLimiter, async (req: Request, res: Response) => {
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

// Get user
router.get("/user", authMiddleware, async (req: Request, res: Response) => {
  const user = req.user;
  res.json({ data: user });
});
export default router;
