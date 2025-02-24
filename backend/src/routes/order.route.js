const express = require("express");
const {
  createOrder,
  deleteOrder,
  fulfillOrder,
  getAssignedOrders,
  getOrderById,
  getOrders,
  updateOrder,
} = require("../controllers/order.controller.js");
const { isAdmin, isWarehouseAdmin } = require("../middleware/auth.js");
const { verifyToken } = require("../utils/verifyUser.js");
const router = express.Router();

// Create Order Route
router.post("/create", verifyToken, isAdmin, createOrder);
router.get("/", getOrders);
router.get("/assigned", getAssignedOrders);
router.get("/:id", getOrderById);
router.put("/fulfill/:id", verifyToken, isWarehouseAdmin, fulfillOrder);
router.put("/update/:id", verifyToken, isWarehouseAdmin, updateOrder);
router.delete("/:id", verifyToken, isAdmin, deleteOrder);

module.exports = router;
