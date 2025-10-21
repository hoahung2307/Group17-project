// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role:{
    type:String,
    enum:["admin","user"],
    default:"user",
  },
  avatar: String,
  status:{
    type:String,
    enum:["active","banned"],
    default:"active",
}
});


export default mongoose.model("User", userSchema);