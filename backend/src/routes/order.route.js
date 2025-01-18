import express from "express";
import { createOrder, deleteOrder, fulfillOrder, getAssignedOrders, getOrderById, getOrders } from "../controllers/order.controller.js";
import { isAdmin, isWarehouseAdmin } from "../middleware/auth.js";
import { verifyToken } from "../utils/verifyUser.js";
const router = express.Router();

// Create Order Route
router.post("/create", verifyToken, isAdmin, createOrder);
router.get("/", getOrders);
router.get("/assigned", getAssignedOrders);
router.get("/:id", getOrderById);
router.put("/fulfill/:id", verifyToken, isWarehouseAdmin, fulfillOrder);
router.delete("/:id", verifyToken, isAdmin, deleteOrder);

export default router;
