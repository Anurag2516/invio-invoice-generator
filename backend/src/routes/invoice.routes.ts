import { Router } from "express";
import {
  createInvoice,
  deleteInvoice,
  getInvoice,
  getInvoices,
  updateInvoice,
} from "../controllers/invoice.controller";
import { isAuthenticated } from "../middleware/auth.middleware";

const router = Router();

router.post("/createInvoice", isAuthenticated, createInvoice);
router.put("/updateInvoice/:id", isAuthenticated, updateInvoice);
router.get("/getInvoice/:id", isAuthenticated, getInvoice);
router.get("/getInvoices", isAuthenticated, getInvoices);
router.delete("/deleteInvoice/:id", isAuthenticated, deleteInvoice);

export default router;
