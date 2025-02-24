const express = require("express");
const {
  getUsers,
  getUser,
  getUserById,
  deleteUser,
  updateUserProfileImage,
} = require("../controllers/user.controller.js");
const { verifyToken } = require("../utils/verifyUser.js");
const { isAdmin } = require("../middleware/auth.js");

const router = express.Router();

router.get("/get-users", isAdmin, getUsers);
router.get("/get-user/:email", getUser);
router.get("/get-user-by-id/:id", getUserById);
router.delete("/delete/:id", verifyToken, isAdmin, deleteUser);
router.post("/update/:id", verifyToken, updateUserProfileImage);

module.exports = router;
