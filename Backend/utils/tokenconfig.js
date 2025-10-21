import jwt from "jsonwebtoken";

export const generateToken = (userId, rememberMe = "false") => {
  const expiresIn = rememberMe === "true" ? "30d" : "3d";
  const maxAge = rememberMe === "true"
    ? 30 * 24 * 60 * 60 * 1000 
    : 3 * 24 * 60 * 60 * 1000; 

  const token = jwt.sign({ userId }, "group17", { expiresIn });
  return token;
}
export const setToken = (res, token) => {
  res.cookie("jwt", token, { httpOnly: true, secure: process.env.NODE_ENV !== "development", maxAge: maxAge });
}