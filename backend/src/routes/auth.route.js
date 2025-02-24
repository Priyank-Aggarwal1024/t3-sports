const express = require("express");
const {
  signup,
  signin,
  google,
  signOut,
  updatePassword,
  verifyResponse,
} = require("../controllers/auth.controller");
const { verifyToken } = require("../utils/verifyUser");

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", google);
router.get("/signout", signOut);
router.post("/updatePassword/:email", updatePassword);
router.get("/check-token", verifyToken, verifyResponse);

module.exports = router;
