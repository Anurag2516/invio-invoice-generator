import { Router } from "express";
import {
  register,
  login,
  logout,
  deleteAccount,
} from "../controllers/auth.controller";
import { isAuthenticated } from "../middleware/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.delete("/deleteAccount/:id", isAuthenticated, deleteAccount);

export default router;
