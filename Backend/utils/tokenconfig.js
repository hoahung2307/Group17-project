import jwt from "jsonwebtoken";

export const generateToken = (userId, rememberMe = "false") => {
  const expiresIn = rememberMe === "true" ? "30d" : "3d";
  const token = jwt.sign({ userId }, "group17", { expiresIn });
  return token;
};

export const setToken = (res, token, rememberMe = "false") => {
  const maxAge = rememberMe === "true" ? 30 * 24 * 60 * 60 * 1000 : 3 * 24 * 60 * 60 * 1000;
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "lax",
    maxAge
  });
};
