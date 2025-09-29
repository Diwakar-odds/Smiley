import express from "express";
import {
  addPaymentMethod,
  getPaymentMethods,
  deletePaymentMethod,
  getLastPaymentMethod,
} from "../controllers/paymentController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();


// New route for last payment method
router.get("/last", authMiddleware, getLastPaymentMethod);

router.post("/", authMiddleware, addPaymentMethod);
router.get("/", authMiddleware, getPaymentMethods);
router.delete("/:id", authMiddleware, deletePaymentMethod);

export default router;
