import { verifyAccessToken } from "../utils/token.js";

export const verify = (req, res, next) => {
  try {
    const { authorization } = req.headers;
    console.log(req.headers);
    if (!authorization) {
      return res.status(403).json({ message: "Invalid token" });
    }
    const decoded = verifyAccessToken(authorization);
    console.log(decoded);
    next();
  } catch (error) {
    console.log(error);
    res.status(403).json({ message: "Access Denied" });
  }
};
