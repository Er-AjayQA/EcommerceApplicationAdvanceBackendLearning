import rateLimit from "express-rate-limit";
import { RedisReply, RedisStore } from "rate-limit-redis";
import redis from "../lib/redis.js";

// Global Limiter
export const globalLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "RateLimiterMessage: Too many requests. Please try again later.",
  },

  standardHeaders: true,
  legacyHeaders: false,

  store: new RedisStore({
    sendCommand: (command: string, ...args: string[]) =>
      redis.call(command, ...args) as Promise<RedisReply>,
    prefix: "global:",
  }),
});

// User Limiter
export const userLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,

  // Dynamic Rate Limiting
  max: async (req) => {
    const role = await req.user?.role;
    if (role === "ADMIN") {
      return 3;
    } else if (role === "SELLER") {
      return 5;
    }

    return 50;
  },

  message: {
    success: false,
    message: "UserLimiterMessage: Rate limiter exceeded for this user.",
  },

  standardHeaders: true,
  legacyHeaders: false,

  keyGenerator: (req) => {
    return (req.user?.id as string) || (req?.ip as string);
  },

  store: new RedisStore({
    sendCommand: (command: string, ...args: string[]) =>
      redis.call(command, ...args) as Promise<RedisReply>,
    prefix: "user:",
  }),
});

// Auth Limiter
export const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: "AuthLimiterMessage: Too many authentication attempts.",
  },

  standardHeaders: true,
  legacyHeaders: false,

  store: new RedisStore({
    sendCommand: (command: string, ...args: string[]) => {
      return redis.call(command, ...args) as Promise<RedisReply>;
    },
    prefix: "auth:",
  }),
});

// Product Limiter
export const productLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30,
  message: {
    success: false,
    message:
      "ProductLimiterMessage: Too many requests. Please try again later.",
  },

  standardHeaders: true,
  legacyHeaders: false,

  store: new RedisStore({
    sendCommand: (command: string, ...args: string[]) =>
      redis.call(command, ...args) as Promise<RedisReply>,
    prefix: "product:",
  }),
});
