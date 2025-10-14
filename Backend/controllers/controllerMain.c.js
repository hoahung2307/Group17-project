import User from "../models/modelMain.m.js";
export const getUsers = async (req, res) => {
    const users = await User.find();
    res.status(200).json({
        message:"lấy user và email thành công",
        Users:users
    })
}
export const postUsers = async (req, res) => {
    try {
      
    const {user,email} = req.body;
        const AddUser = await User(
        {
            user:user,
            email:email
        });

        AddUser.save();

        res.status(200).json({
            message:"thêm user và email thành công",
            user:user,
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
        const {user,email} = req.body;
      
        if(!user && !email){
            res.status(200).json({
                message:"update user và email thành công",
                user:user,
                email:email
            });
        }
        const checkUser = await User.findById(id);
        if(!checkUser){
            res.status(404).json({
                message:"user không tồn tại"
            });
        }
        await User.findByIdAndUpdate(id, {user:user||checkUser.user,email:email||checkUser.email});
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