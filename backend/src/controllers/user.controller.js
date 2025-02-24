const User = require("../models/user.model.js");
const { errorHandler } = require("../utils/error.js");
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return next(errorHandler(404, "User not found!"));
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(errorHandler(404, "User not found!"));
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted successfully!" });
  } catch (error) {
    next(error);
  }
};
const updateUserProfileImage = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(404).json({ message: "User not found" });
    }
    const upadtedData = req.body;
    if (upadtedData.password || upadtedData.email || upadtedData.username) {
      return res.status(400).json({ message: "Invalid data" });
    }
    const user = await User.findByIdAndUpdate(userId, upadtedData, {
      new: true,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
module.exports = {
  deleteUser,
  getUser,
  getUserById,
  updateUserProfileImage,
  getUsers,
};
