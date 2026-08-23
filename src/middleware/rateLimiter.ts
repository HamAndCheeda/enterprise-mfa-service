import rateLimit from 'express-rate-limit';

export const rateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

export const mfaLimiter = rateLimit({
  windowMs: parseInt(process.env.MFA_RATE_LIMIT_WINDOW_MS || '300000'),
  max: parseInt(process.env.MFA_RATE_LIMIT_MAX_ATTEMPTS || '5'),
  message: 'Too many MFA attempts, please try again later',
  skipSuccessfulRequests: true,
});
