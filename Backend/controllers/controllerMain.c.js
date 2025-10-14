export const getUsers = (req, res) => {res.send("đây là controller users")}
export const postUsers = (req, res) => {
    req.body = {user,email}
    res.status(200).json({
        message:"thêm user và email thành công",
        user:user,
        email:email
    })
}