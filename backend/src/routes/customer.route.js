// routes/customerRoutes.js
const express = require("express");
const {
  createCustomer,
  getCustomerBySearch,
  getCustomers,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/customer.controller.js");
const router = express.Router();
const { isAdmin } = require("../middleware/auth.js");
const { verifyToken } = require("../utils/verifyUser.js");

router.get("/", verifyToken, getCustomers);
router.post("/create", verifyToken, isAdmin, createCustomer);
router.post("/search", verifyToken, isAdmin, getCustomerBySearch);
router.put("/customer/:id", verifyToken, isAdmin, updateCustomer);
router.delete("/customer/:id", verifyToken, isAdmin, deleteCustomer);

module.exports = router;
