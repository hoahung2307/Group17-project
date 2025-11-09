import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: ["admin", "user", "moderator"],
    default: "user",
  },
  avatar: {
    type: String,
    default: "",
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  resetPasswordToken: {
    type: String,
    default: "",
  },
  resetPasswordExpire: {
    type: Date,
    default: Date.now,
  },
  refreshToken: {
    type: String,
    default: "",
  },
});

export default mongoose.model("User", userSchema);
