const jwt = require('jsonwebtoken');
const { ServerConfig } = require('../config');

// Middleware to extract user email from JWT and add to request headers
// This middleware runs on ALL requests going through the API Gateway
// and attaches the authenticated user's email to headers for downstream services
const attachUserToHeaders = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Get Bearer token
    
    if (token) {
      const decodedToken = jwt.verify(token, ServerConfig.JWT_SECRET)
      // Add user info to headers for downstream services
      req.headers['x-user-id'] = decodedToken.id;
      req.headers['x-user-email'] = decodedToken.email;
      req.headers['x-user-role'] = decodedToken.role;
    }
    next();
  } catch (error) {
    res.status(403).json({})
  }
};

module.exports = {
  attachUserToHeaders
};
