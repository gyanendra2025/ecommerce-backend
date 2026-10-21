import { verifyToken } from "../utils/jwt.js";

const optionalAuthenticate = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return next(); // no token — proceed as guest, req.user stays undefined
  }

  const token = header.split(" ")[1];
  try {
    req.user = verifyToken(token);
  } catch (error) {
    // invalid/expired token on a public route — ignore it, treat as guest
    // don't throw — public route shouldn't break over a bad token
  }
  next();
};

export default optionalAuthenticate;
