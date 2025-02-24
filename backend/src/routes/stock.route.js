const express = require("express");
const {
  viewAllStocks,
  updateStock,
  transferStock,
} = require("../controllers/stockController.js");
const { isAdmin } = require("../middleware/auth.js");
const { verifyToken } = require("../utils/verifyUser.js");

const router = express.Router();

router.get("/", verifyToken, isAdmin, viewAllStocks);
router.post("/update", verifyToken, isAdmin, updateStock);
router.post("/transfer", verifyToken, isAdmin, transferStock);

module.exports = router;
