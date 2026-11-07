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

    let count;
    try {
      count = await redis.incr(key);
      if (count === 1) {
        await redis.expire(key, windowSeconds);
      }
    } catch (error) {
      console.error("Rate limiter Redis error, failing open:", error.message);
      return next();
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
