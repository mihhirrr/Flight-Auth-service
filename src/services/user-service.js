const { UserRepository } = require('../repositories')
const { ServerConfig } = require('../config')
const AppError = require('../utils/Error-handler/AppError')
const { StatusCodes } = require('http-status-codes')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

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
      const email = data.email
      const user = await userRepo.findOne(email)
      if(!user){
        throw new AppError('User not found with specified email address.', 
          StatusCodes.NOT_FOUND);
      }

      const isPasswordCorrect = await bcrypt.compare(data.password, user.password);

      if(!isPasswordCorrect){
        throw new AppError("Authentication Failed! Incorrect password.", 
          StatusCodes.BAD_REQUEST);
      }

      const token = jwt.sign({ email : user.email }, ServerConfig.JWT_SECRET)
      return token

  } catch (error) {
      throw error
  }
}

module.exports = {
      userSignup,
      userLogin
}