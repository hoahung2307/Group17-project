import User from "../models/modelMain.m.js";
import bcrypt from "bcrypt";
export const getUsers = async (req, res) => {
    const users = await User.find();
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
    const {email,password} = req.body;
    const isEmail = await User.exists({ email: email });
        if (!isEmail) {
            return res.status(404).json({
                message:"Email Không Tồn Tại"
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

        const token = generateToken(user._id, rememberMe || "false");
        setToken(res, token);
        return res.status(200).json({
            message:"login thành công",
        })

}
export const Register = async (req,res) =>{
    const {email,password,name} = req.body;
    const isEmail = await User.exists({ email: email });
    if(isEmail){
        return res.status(400).json({
            message:"Email Đã Tồn Tại"
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