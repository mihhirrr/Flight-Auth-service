const { UserRepository } = require('../repositories')
const { ServerConfig } = require('../config')
const AppError = require('../utils/Error-handler/AppError')
const { StatusCodes } = require('http-status-codes')
const jwt = require('jsonwebtoken')
const comparePasswords = require('../utils/common-utils/compare-password')

const userRepo = new UserRepository();

const userSignup = async (data) => {
      try {
           const createdUser = await userRepo.create(data)
           return createdUser
      } catch (error) {

        if (error.name === "SequelizeValidationError") {
          throw new AppError(error.message, StatusCodes.BAD_REQUEST);
        }

        if(error.name === 'SequelizeUniqueConstraintError') {
          throw new AppError('Email already exists. Please try with different email.', 
            StatusCodes.BAD_REQUEST);
        }

        throw new AppError("An error occured during Sign up! Please retry.", 
            StatusCodes.INTERNAL_SERVER_ERROR);
      }
    };

const userLogin = async(data) => {
  try {
      const { email } = data
      const user = await userRepo.findOne(email)  //finding the user by email

      if(!user){
        throw new AppError('User not found with specified email address.', 
          StatusCodes.NOT_FOUND);
      }

      const isPasswordCorrect = await comparePasswords(data.password, user.password)   //comparing the passwords from the request body and the stored user password

      if(!isPasswordCorrect){
        throw new AppError("Authentication Failed! Incorrect password.", 
          StatusCodes.UNAUTHORIZED);
      }

      const token = jwt.sign({ email : user.email }, ServerConfig.JWT_SECRET, {  expiresIn: ServerConfig.JWT_EXPIRY })
      return token

  } catch (error) {
      throw error
  }
}

module.exports = {
      userSignup,
      userLogin
}