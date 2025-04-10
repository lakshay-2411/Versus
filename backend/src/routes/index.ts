import { Router } from "express";
import AuthRoutes from "./authRoutes";
import VerifyRoutes from "./verifyRoutes";
import passwordRoutes from "./passwordRoutes";
import clashRoutes from "./clashRoutes";
import authMiddleware from "../middleware/AuthMiddleware";

const router = Router();

router.use("/api/auth", AuthRoutes);
router.use("/api/auth", passwordRoutes);
router.use("/", VerifyRoutes);
router.use("/api/clash", authMiddleware, clashRoutes);

export default router;
