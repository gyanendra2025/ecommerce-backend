import { verifyToken } from "../utils/jwt.js";
import AppError from "../utils/AppError.js";

const authenticate = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return next(new AppError(401, "Authentication Required"));
  }

  const token = header.split(" ")[1];
  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return next(new AppError(401, "Invalid or expired token"));
  }
};

export default authenticate;
