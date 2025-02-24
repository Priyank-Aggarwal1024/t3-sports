const express = require("express");
const { isAdmin } = require("../middleware/auth.js");
const { verifyToken } = require("../utils/verifyUser.js");
const {
  createLedger,
  getAllLedgers,
  updateLedger,
} = require("../controllers/ledger.controller.js");

const router = express.Router();

router.get("/", verifyToken, getAllLedgers);
router.post("/create", verifyToken, isAdmin, createLedger);
router.put("/:id", verifyToken, isAdmin, updateLedger);

module.exports = router;
