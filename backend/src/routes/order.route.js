import express from "express";
import { createOrder, getAssignedOrders, getOrders } from "../controllers/order.controller.js";
const router = express.Router();

// Create Order Route
router.post("/create", createOrder);
router.get("/", getOrders);
router.get("/assigned", getAssignedOrders);

export default router;
