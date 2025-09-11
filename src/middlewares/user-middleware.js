const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken')
const { ServerConfig } = require('../config')
const { Error } = require('../utils/common-utils');
const AppError = require('../utils/Error-handler/AppError');


// User authentication validation
const Auth = async (req, res, next) => {
  const { email, password } = req.body;

  if (!(email && password)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      ...Error,
      error: "Both Email and Password are required",
    });
  }
  next();
};


// protected route middleware for checking if the user authorisation
const isAuthenticated = async(req, res, next) => {
    const token = req.headers['token']

    if(!token){
      return res.status(StatusCodes.BAD_REQUEST).json({
        ...Error,
        message: "Please login to access this resourse!",
        error: {
          message: "Token not found!",
        },
      });
    }

    try {
      const decoded = await jwt.verify(token, ServerConfig.JWT_SECRET);
      if(decoded){
          next();
      }
    } catch (error) {
      if(error.name === 'TokenExpiredError'){
        error.message = "Session expired! Please login again!"
      }
      return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
        ...Error,
        message: error.message,
        error: error.name,
      });
    }
}


module.exports = {
  Auth,
  isAuthenticated
}