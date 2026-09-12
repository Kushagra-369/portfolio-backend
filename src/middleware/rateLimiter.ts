import rateLimit from "express-rate-limit";


// ==========================================
// General API Rate Limiter
// ==========================================

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes

  // Maximum 100 requests from one IP
  max: 100,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});


export const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes

  // Maximum 5 contact messages from one IP
  max: 5,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many messages sent. Please try again later.",
  },
});