const User = require("../models/user.model.js");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
// Authentication Controllers
const signup = async (req, res, next) => {
  const { username, email, password, name, phoneNo } = req.body;

  try {
    if (await User.findOne({ $or: [{ email }, { phoneNo }, { username }] })) {
      return res.status(400).json({
        success: false,
        message:
          "User already exists with same email, phone number, or username",
      });
    }

    const hashedPass = bcryptjs.hashSync(password, 10);
    const newUser = new User({
      name,
      username,
      email,
      password: hashedPass,
      phoneNo,
    });
    await newUser.save();

    res.status(201).json("User created");
  } catch (e) {
    next(e);
  }
};

const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const validUser = await User.findOne({ email });
    if (!validUser || !bcryptjs.compareSync(password, validUser.password)) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_KEY, {
      expiresIn: "365d",
    });
    res
      .cookie("access_token", token, {
        sameSite: "none",
        secure: true,
        httpOnly: true,
      })
      .status(200)
      .json({ ...validUser._doc, password: undefined });
  } catch (e) {
    next(e);
  }
};

const google = async (req, res, next) => {
  const { email, name, photo } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      const generatedPassword = bcryptjs.hashSync(
        otpGenerator.generate(12, { specialChars: false }),
        10
      );
      user = new User({
        username:
          email.split("@")[0] +
          otpGenerator.generate(4, { specialChars: false }),
        name,
        email,
        password: generatedPassword,
        avatar: photo,
      });
      await user.save();
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, {
      expiresIn: "365d",
    });
    res
      .cookie("access_token", token, {
        sameSite: "none",
        secure: true,
        httpOnly: true,
      })
      .status(200)
      .json({ ...user._doc, password: undefined });
  } catch (error) {
    next(error);
  }
};

const signOut = (req, res) => {
  res.clearCookie("access_token").status(200).json("Signed Out");
};

const updatePassword = async (req, res, next) => {
  const { email } = req.params;
  const { password } = req.body;

  try {
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $set: { password: hashedPassword } },
      { new: true }
    );

    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json("Password updated successfully");
  } catch (error) {
    next(error);
  }
};

const verifyResponse = (req, res) => {
  res
    .status(200)
    .json({ success: true, message: "Token is valid", user: req.user });
};
module.exports = {
  signup,
  signin,
  google,
  signOut,
  updatePassword,
  verifyResponse,
};
