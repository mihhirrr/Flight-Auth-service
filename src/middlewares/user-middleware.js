const { StatusCodes } = require('http-status-codes');
const zod = require('zod');
const jwt = require('jsonwebtoken')
const { ServerConfig } = require('../config')

const { Error } = require('../utils/common-utils');
const AppError = require('../utils/Error-handler/AppError');

// Zod schema
const userInputSchema = zod.object({
  email: zod
    .string()
    .email("Invalid email format"),

  password: zod
    .string()
    .min(6, "Password must be at least 6 characters long"),

  DoB: zod
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Date of Birth must be a valid date",
    }),
});

// User authentication validation
const Auth = async (req, res, next) => {
  const { email, password, DoB } = req.body;

  if (!email || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      ...Error,
      error: "Email and Password both are required",
    });
  }

  // Validate input using Zod schema
  const validationResult = userInputSchema.safeParse({ email, password, DoB });

  if (!validationResult.success) {
    const formattedErrors = validationResult.error.errors.map((err) => ({
      field: err.path[0],
      message: err.message,
    }));

    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      ...Error,
      message: "Unable to create user!",
      error: formattedErrors,
    });
  }

  next();
};

const isAuthenticated = async(req, res, next) => {
    const token = req.headers['token']

    if(!token){
      return res.status(StatusCodes.BAD_REQUEST).json({
        ...Error,
        message: "Please login to access this resourse!",
        error: {},
      });
    }

    try {
      const decoded = await jwt.verify(token, ServerConfig.JWT_SECRET);
      if(decoded){
          next();
      }
    } catch (error) {
      if(error.name === 'TokenExpiredError'){
        error.message = "Session expired!"
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