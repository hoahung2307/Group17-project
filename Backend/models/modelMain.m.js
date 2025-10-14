// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  user: String,
  email: String,
});

export default mongoose.model("User", userSchema);