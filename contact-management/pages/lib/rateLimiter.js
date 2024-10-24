const rateLimit = require('express-rate-limit');


const createRateLimiter = (maxRequests, windowMs) => {
  return rateLimit({
    windowMs, 
    max: maxRequests, 
    message: 'Too many requests, please try again later.',
    standardHeaders: true, 
    legacyHeaders: false, 
  });
};

const sensitiveRoutesLimiter = createRateLimiter(5, 15 * 60 * 1000); 

module.exports = {
  createRateLimiter,
  sensitiveRoutesLimiter,
};
