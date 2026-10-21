import AppError from "../utils/AppError.js";

const authorize =
  (...allowedRoles) =>
  (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError(403, "Forbidden"));
    }
    next();
  };

export default authorize;
