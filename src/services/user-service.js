const { ServerConfig } = require('../config')
const AppError = require('../utils/Error-handler/AppError')
const { StatusCodes } = require('http-status-codes')
const { UserRepository } = require('../repositories')

const userRepo = new UserRepository();

const userSignup = async (data) => {
      try {
           const createdUser = await userRepo.create(data)
           return createdUser
      } catch (error) {
        console.log(error)

        if (error.name === "SequelizeValidationError") {
          throw new AppError(error.message, StatusCodes.BAD_REQUEST);
        }

        if(error.name = 'SequelizeUniqueConstraintError') {
          throw new AppError('Email already exists. Please try with different email.', 
            StatusCodes.BAD_REQUEST);
        }

        throw new AppError("An error occured during Sign up! Please retry.", 
            StatusCodes.INTERNAL_SERVER_ERROR);
      }
    };

module.exports = {
      userSignup
}