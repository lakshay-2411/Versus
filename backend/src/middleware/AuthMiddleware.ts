import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader === null || authHeader === undefined) {
      res.status(401).json({ status: 401, message: "Unauthorized" });
      return;
    }
    const token = authHeader.split(" ")[1];

    // verify token

    jwt.verify(token, process.env.SECRET_KEY!, (err, user) => {
      if (err) {
        res.status(401).json({ status: 401, message: "Unauthorized" });
        return;
      }
      req.user = user as AuthUser;
      next();
    });
  } catch (error) {
    console.error("Middleware error:", error);
    res.status(500).json({ status: 500, message: "Internal server error" });
  }
};

export default authMiddleware;
