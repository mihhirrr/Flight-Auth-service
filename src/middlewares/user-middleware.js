const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken')
const { ServerConfig } = require('../config')
const { Error } = require('../utils/common-utils');

const { Enums } = require('../utils/common-utils');
const AppError = require('../utils/Error-handler/AppError');
const { ADMIN, STAFF } = Enums.User_Profile
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
      if(error.name === 'JsonWebTokenError'){
        error.message = "Invalid Token!"
      }
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

const isAdmin = async (req, res, next) => {
    const token = req.headers['token']

    if(!token){                         //Reject is no token provided
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
      console.log(decoded.role, " ", ADMIN)
      if(decoded.role !== ADMIN){
        throw new AppError('You are not an admin!', StatusCodes.UNAUTHORIZED)
      }
      next()
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

const isStaff = async (req, res, next) => {
  const token = req.headers['token']

  if(!token){                         //Reject is no token provided
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
    console.log(decoded.role, " ", STAFF)
    if(decoded.role !== STAFF){
      throw new AppError('You are not authorized to access this resource!', StatusCodes.UNAUTHORIZED)
    }
    next()
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
  isAuthenticated,
  isAdmin,
  isStaff
}