import User from "../models/modelMain.m.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { logAdminAction } from "../utils/logger.js";
import bcrypt from "bcrypt";
import { generateToken, setToken } from "../utils/tokenconfig.js";
import jwt from "jsonwebtoken";
export const getUsers = async (req, res) => {
    console.log("controller get users", new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }));
    const users = await User.find().select('-password');
    res.status(200).json({
        message:"lấy user và email thành công",
        Users:users
    })
}
export const postUsers = async (req, res) => {
    try {
      
    const {name,email} = req.body;
        const AddUser = await User(
        {
            name:name,
            email:email
        });

        AddUser.save();

        res.status(200).json({
            message:"thêm user và email thành công",
            name:name,
            email:email
        })
    } catch (error) {
        res.status(500).json({
            message:"thêm user và email thất bại",
            error:error
        })
    }
}
export const deleteUsers = async (req, res) => {
    console.log("controller delete users", new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }));
    try {
        const {id} = req.params;
        if(!id){
            res.status(404).json({
                message:"user không tồn tại"
            });
        }
        await User.findByIdAndDelete(id);
        res.status(200).json({
            message:"xóa user và email thành công",
        })
    } catch (error) {
        res.status(500).json({
            message:"xóa user và email thất bại",
            error:error
        })
    }
}
export const updateUsers = async (req, res) => {
    console.log("controller update users", new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }));
    try {
        const {id} = req.params;
        const {name,email} = req.body;
      
        if(!name && !email){
            res.status(200).json({
                message:"update user và email thành công",
                name:name,
                email:email
            });
        }
        const checkUser = await User.findById(id);
        if(!checkUser){
            res.status(404).json({
                message:"user không tồn tại"
            });
        }
        await User.findByIdAndUpdate(id, {name:name||checkUser.name,email:email||checkUser.email});
        res.status(200).json({
            message:"cập nhật user và email thành công",
        })
    } catch (error) {
        res.status(500).json({
            message:"cập nhật user và email thất bại",
            error:error
        })
    }
}
export const Login = async (req,res) =>{
    console.log("controller login", new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }));
    const {email,password} = req.body;
    const isEmail = await User.exists({ email: email });
        if (!isEmail) {
            return res.status(404).json({
                message:"Email Không Tồn Tại"
            })
        }
        if(!email){
            return res.status(400).json({
                message:"Vui lòng nhập email"
            })
        }
        if(!password){
            return res.status(400).json({
                message:"Vui lòng nhập mật khẩu"
            })
        }

        const user = await User.findOne({ email: email });

        if(!user){
            return res.status(404).json({
                message:"Người Dùng Không Tồn Tại"
            })
        }
        const verifyPassword = await bcrypt.compare(password, user.password);
        if(!verifyPassword){
            return res.status(400).json({
                message:"Sai Mật Khẩu Vui Lòng Nhập Lại Mật Khẩu"
            })
        }

        const token = generateToken(user._id,  "false");
        setToken(res, token, "false");
        const refreshToken = generateToken(user._id,  "true");
        await User.findByIdAndUpdate(user._id, {refreshToken:refreshToken});

        return res.status(200).json({
            message:"login thành công",
            refreshToken:refreshToken
        })

}
export const Register = async (req,res) =>{
    console.log("controller register", new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }));
    const {email,password,name} = req.body;
    const isEmail = await User.exists({ email: email });
    if(isEmail){
        return res.status(400).json({
            message:"Email Đã Tồn Tại"
        })
    }
    if(!email){
        return res.status(400).json({
            message:"Vui lòng nhập email"
        })
    }
    if(!password){
        return res.status(400).json({
            message:"Vui lòng nhập mật khẩu"
        })
    }
    if(!name){
        return res.status(400).json({
            message:"Vui lòng nhập tên"
        })
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const user = await User.create({ email: email, password: hashedPassword, name: name });
    if(!user){
        return res.status(400).json({
            message:"Đăng Ký Thất Bại"
        })
    }
    return res.status(200).json({
        message:"Đăng Ký Thành Công"
    })
}
export const logout = async (req,res) => {
    console.log("controller logout", new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }));
    try {
    res.cookie("jwt", "", { maxAge: 0 });
        return res.status(200).json({
            message:"Đăng Xuất Thành Công"
        });
    } catch (error) {
        res.status(500).json({
            message:"Đăng Xuất Thất Bại",
            error:error
        })
    }
}

export const refreshAccessToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ message: "Thiếu refreshToken" });
        }

        let decoded;
        try {
            decoded = jwt.verify(refreshToken, "group17");
        } catch (err) {
            return res.status(401).json({ message: "Refresh token không hợp lệ hoặc hết hạn" });
        }

        const user = await User.findById(decoded.userId);
        if (!user || user.refreshToken !== refreshToken) {
            return res.status(401).json({ message: "Refresh token không hợp lệ" });
        }

        const newAccessToken = generateToken(user._id, "false");
        setToken(res, newAccessToken, "false");

        return res.status(200).json({
            message: "Làm mới access token thành công",
        });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
}
export const getMe = async (req,res) => {
    const user = await User.findById(req.userId);
    if(!user){
        return res.status(404).json({
            message:"Người Dùng Không Tồn Tại"
        })
    }
    user.password = "";
    return res.status(200).json({
        message:"Lấy Thông Tin Người Dùng Thành Công",
        user:user
    })
}
export const updateName = async (req,res) => {
    console.log("controller update name", new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }));
    const {name} = req.body;
    const user = await User.findById(req.userId);
    if(!user){
        return res.status(404).json({
            message:"Người Dùng Không Tồn Tại"
        })
    }
    if(!name){
        return res.status(400).json({
            message:"Vui lòng nhập tên"
        })
    }
    user.name = name;
    await user.save();
    return res.status(200).json({
        message:"Cập Nhật Tên Thành Công",
    })
}
export const updatePassword = async (req,res) => {
    console.log("controller update password", new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }));
    const {oldPassword,newPassword} = req.body;
    const user = await User.findById(req.userId);
    if(!user){
        return res.status(404).json({
            message:"Người Dùng Không Tồn Tại"
        })
    }
    if(!oldPassword && !newPassword){
        return res.status(400).json({
            message:"Vui lòng nhập mật khẩu cũ và mật khẩu mới"
        })
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    await user.save();
    return res.status(200).json({
        message:"Cập Nhật Mật Khẩu Thành Công",
    })
}
export const updateImageProfile = async (req,res) => {
    console.log("controller update image profile", new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }));
    const file = req.file;
    if(!file){
        return res.status(400).json({
            message:"Vui lòng upload ảnh"
        })
    }
    const user = await User.findById(req.userId);
    if(!user){
        return res.status(404).json({
            message:"Người Dùng Không Tồn Tại"
        })
    }
    user.avatar = file.path;
    await user.save();
    return res.status(200).json({
        message:"Cập Nhật Ảnh Thành Công",
    })
}
export const deleteAccount = async (req,res) => {
    console.log("controller delete account from user", new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }));
    try {
    const userId = req.userId;
    const user = User.findById(userId);
    if (!user){
        return res.status(404).json({
            message:"Người Dùng Không Tồn Tại"
        })
    }
    await user.deleteOne();
    res.cookie("jwt", "", { maxAge: 0 });
    return res.status(200).json({
        message:"Xóa Tài Khoản Thành Công",
    })
    } catch (error) {
        res.status(500).json({
            message:"Xóa Tài Khoản Thất Bại",
            error:error
        })
    }
}
export const deleteAccountFromAdmin = async (req,res) => {
    console.log("controller delete account from admin", new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }));
    try {
    const {id} = req.params;
    const user = await User.findById(id);
    if(!user){
        return res.status(404).json({
            message:"Người Dùng Không Tồn Tại"
        })
    }
    await User.findByIdAndDelete(id);
    logAdminAction(req.userId, "deleteAccountFromAdmin", user.email);
    return res.status(200).json({
        message:"Xóa Tài Khoản Thành Công",
    })
    } catch (error) {
        res.status(500).json({
            message:"Xóa Tài Khoản Thất Bại",
            error:error
        })
    }
}
export const forgotPassword = async (req,res) => { 
    console.log("controller forgot password", new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }));
    try {
    const {email} = req.body;
    const user = await User.findOne({email:email});
    if(!user){
        return res.status(404).json({
            message:"Email Không Tồn Tại"
        })
    }
    const resetPasswordToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; 
    await user.save();
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: "vinh223522@student.nctu.edu.vn",
          pass: "hgsp ndag tttv igcw",
        },
      });
      const resetLink = `http://localhost:5173/reset-password/${resetPasswordToken}`;
      await transporter.sendMail({
        from: "vinh223522@student.nctu.edu.vn",
        to: email,
        subject: "Reset Password",
        html: `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Đặt lại mật khẩu</title>
  <style>
    body {
      background-color: #f2f3f5;
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }
    .header {
      background: #2563eb;
      color: white;
      padding: 20px;
      text-align: center;
    }
    .header h2 {
      margin: 0;
    }
    .content {
      padding: 30px;
      color: #333333;
      line-height: 1.6;
    }
    .btn {
      display: inline-block;
      background-color: #2563eb;
      color: #ffffff !important;
      text-decoration: none;
      padding: 12px 24px;
      border-radius: 6px;
      font-weight: bold;
      margin-top: 20px;
    }
    .footer {
      text-align: center;
      padding: 20px;
      background-color: #f9fafb;
      color: #888888;
      font-size: 13px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Đặt lại mật khẩu</h2>
    </div>
    <div class="content">
      <p>Xin chào <strong>${email}</strong>,</p>
      <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
      <p>Nhấn vào nút bên dưới để đặt lại mật khẩu. Liên kết này chỉ có hiệu lực trong vòng <strong>15 phút</strong>.</p>
      <p style="text-align:center;">
        <a href="${resetLink}" class="btn">Đặt lại mật khẩu</a>
      </p>
      <p>Nếu bạn không yêu cầu, vui lòng bỏ qua email này.</p>
      <p>Trân trọng,<br>Đội ngũ hỗ trợ Group 17</p>
    </div>
    <div class="footer">
      <p>© 2025 Group 17. Tất cả các quyền được bảo lưu.</p>
    </div>
  </div>
</body>
</html>
${resetLink}`,
      });
      res.status(200).json({
        message:"Gửi Link Reset Mật Khẩu Thành Công",
      })
    } catch (error) {
        res.status(500).json({
            message:"Gửi Link Reset Mật Khẩu Thất Bại",
            error:error
        })
    }
    
}

export const resetPassword = async (req, res) => {
  try {
    console.log("controller reset password", new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }));
    const { resetPasswordToken } = req.params;
    const { newPassword } = req.body;
    const user = await User.findOne({
      resetPasswordToken: resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({
        message: "Token không hợp lệ hoặc đã hết hạn",
      });
    }
    if(!newPassword){
      return res.status(400).json({
        message:"Vui lòng nhập mật khẩu mới"
      })
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    user.resetPasswordToken = "";
    user.resetPasswordExpire = Date.now();

    await user.save();

    return res.status(200).json({
      message: "Đặt lại mật khẩu thành công",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server khi đặt lại mật khẩu",
      error: error.message,
    });
  }
};
