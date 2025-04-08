import { Router } from "express";
import AuthRoutes from "./authRoutes";
import VerifyRoutes from "./verifyRoutes";
import passwordRoutes from "./passwordRoutes";

const router = Router();

router.use("/api/auth", AuthRoutes);
router.use("/api/auth", passwordRoutes);
router.use("/", VerifyRoutes);

export default router;
