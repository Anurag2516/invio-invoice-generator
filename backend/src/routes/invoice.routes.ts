import { Router } from "express";
import {
  autoSaveInvoice,
  createDraftInvoice,
  deleteInvoice,
  getDashboardStats,
  getInvoice,
  getInvoices,
  saveInvoice,
} from "../controllers/invoice.controller";
import { isAuthenticated } from "../middleware/auth.middleware";

const router = Router();

router.post("/createInvoice/draft", isAuthenticated, createDraftInvoice);
router.patch("/autoSaveInvoice/:id", isAuthenticated, autoSaveInvoice);
router.put("/saveInvoice/:id", isAuthenticated, saveInvoice);
router.get("/getInvoice/:id", isAuthenticated, getInvoice);
router.get("/getInvoices", isAuthenticated, getInvoices);
router.delete("/deleteInvoice/:id", isAuthenticated, deleteInvoice);
router.get("/getDashboardStats", isAuthenticated, getDashboardStats);

export default router;
