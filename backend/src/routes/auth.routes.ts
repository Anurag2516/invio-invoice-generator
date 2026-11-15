import { Router } from "express";
import {
  getMe,
  register,
  login,
  logout,
  deleteAccount,
} from "../controllers/auth.controller";
import { isAuthenticated } from "../middleware/auth.middleware";

const router = Router();

router.get("/me", isAuthenticated, getMe)
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/deleteAccount", isAuthenticated, deleteAccount);

export default router;
