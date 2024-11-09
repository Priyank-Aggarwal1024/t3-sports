import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, unique: true },
  phone: { type: String },
  password: { type: String, required: true },
  avatar: { type: String, default: "https://cdn.shopify.com/s/files/1/0870/1689/8874/files/reshot-icon-user-profile-68ZR2F7VPJ.svg?v=1721495086" },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
export default User;