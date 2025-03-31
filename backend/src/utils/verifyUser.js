const jwt = require("jsonwebtoken");
const User = require("../models/user.model.js");
const { errorHandler } = require("../utils/error.js");

const verifyToken = async (req, res, next) => {
  const token = req.headers["authorization"]?.startsWith("Bearer ")
    ? req.headers["authorization"].slice(7)
    : req.cookies.access_token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized access: No token provided.",
    });
  }
  jwt.verify(token, process.env.JWT_KEY, async (err, decoded) => {
    if (err) {
      return res
        .status(403)
        .json({ success: false, message: "Forbidden: Invalid token." });
    }

    try {
      const user = await User.findById(decoded.id);
      if (!user) {
        return next(errorHandler(404, "User not found"));
      }

      req.user = user;
      next();
    } catch (error) {
      next(error);
    }
  });
};
module.exports = { verifyToken };
