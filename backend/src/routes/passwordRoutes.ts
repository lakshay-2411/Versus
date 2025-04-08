import { Router, Request, Response } from "express";
import { authLimiter } from "../config/rateLimit";
import { ZodError } from "zod";
import { checkDateHourDiff, formatError, renderEmailEjs } from "../helper";
import {
  forgetPasswordSchema,
  resetPasswordSchema,
} from "../validation/passwordValidation";
import bcrypt from "bcrypt";
import { v4 as uuidV4 } from "uuid";
import prisma from "../config/database";
import { emailQueue, emailQueueName } from "../jobs/EmailJob";
const router = Router();

router.post(
  "forget-password",
  authLimiter,
  async (req: Request, res: Response) => {
    try {
      const body = req.body;
      const payload = forgetPasswordSchema.parse(body);

      // check if user exists
      let user = await prisma.user.findUnique({
        where: { email: payload.email },
      });
      if (!user || user === null) {
        res.status(422).json({
          message: "Invalid data",
          errors: {
            email: "No user found with this email.",
          },
        });
      }
      const salt = await bcrypt.genSalt(10);
      const token = await bcrypt.hash(uuidV4(), salt);
      await prisma.user.update({
        data: {
          password_reset_token: token,
          token_send_at: new Date().toISOString(),
        },
        where: {
          email: payload.email,
        },
      });

      const url = `${process.env.CLIENT_APP_URL}/reset-password?email=${payload.email}&token=${token}`;
      const html = renderEmailEjs("forget-password", { url: url });
      await emailQueue.add(emailQueueName, {
        to: payload.email,
        subject: "Reset Password",
        body: html,
      });

      res.json({ message: "Check your email for reset password link." });
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

// Reset password
router.post("/reset-password", async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const payload = resetPasswordSchema.parse(body);
    // check if user exists
    let user = await prisma.user.findUnique({
      where: { email: payload.email },
    });
    if (!user || user === null) {
      res.status(422).json({
        message: "Invalid data",
        errors: {
          email: "Link is not correct. Please try again.",
        },
      });
      return;
    }
    // check if token is valid
    if (user?.password_reset_token !== payload.token) {
      res.status(422).json({
        message: "Invalid data",
        errors: {
          email: "Link is not correct. Please try again.",
        },
      });
      return;
    }
    // check if token is expired
    const hoursDiff = checkDateHourDiff(user?.token_send_at!);
    if (hoursDiff > 2) {
      res.status(422).json({
        message: "Invalid data",
        errors: {
          email: "Link is expired. Please try again.",
        },
      });
      return;
    }
    // Update password
    const salt = await bcrypt.genSalt(10);
    const newPass = await bcrypt.hash(payload.password, salt);
    await prisma.user.update({
      data: {
        password: newPass,
        password_reset_token: null,
        token_send_at: null,
      },
      where: {
        email: payload.email,
      },
    });

    res.json({
      message: "Password updated successfully. You can login now.",
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

export default router;
