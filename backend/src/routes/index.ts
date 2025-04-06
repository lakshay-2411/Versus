import { Router } from "express";
import AuthRoutes from "./authRoutes";
import VerifyRoutes from "./verifyRoutes";

const router = Router();

router.use("/api/auth", AuthRoutes);
router.use("/", VerifyRoutes);

export default router;
