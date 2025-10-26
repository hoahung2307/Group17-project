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
  avatar: {
    type: String,
    default:"",
  },
  status:{
    type:String,
    enum:["active","banned"],
    default:"active",
  },
  resetPasswordToken:{
    type:String,
    default:"",
  },
  resetPasswordExpire:{
    type:Date,
    default:Date.now,
},
});


export default mongoose.model("User", userSchema);