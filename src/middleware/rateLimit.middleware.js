import redis from "../config/redis.js";
import AppError from "../utils/AppError.js";

const rateLimit = ({
  windowMs,
  max,
  keyPrefix,
  keyGenerator = (req) => req.ip.replace(/^::ffff:/, ""),
}) => {
  const windowSeconds = Math.ceil(windowMs / 1000);

  return async (req, res, next) => {
    const key = `ratelimit:${keyPrefix}:${keyGenerator(req)}`;

    const count = await redis.incr(key);
    if (count === 1) {
      await redis.expire(key, windowSeconds);
    }

    if (count > max) {
      return next(
        new AppError(429, "Too many requests, please try again later"),
      );
    }

    next();
  };
};

export default rateLimit;
