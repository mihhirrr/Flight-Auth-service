const { UserService } = require("../services");
const { StatusCodes } = require("http-status-codes");
const { Error, Success } = require("../utils/common-utils");

async function userSignup(req, res, next) {
      const { email, password } = req.body;
    
      try {
        const createdUser = await UserService.userSignup({
            email,
            password,
        });

        const SuccessResponse = { 
            ...Success,
            message: "User created successfully",
            data: createdUser
         }

        return res.status(StatusCodes.CREATED).json(SuccessResponse);
      } catch (error) {

        const ErrorResponse = { 
            ...Error,
            message: "Unable to create user!",
            error: {
                  message: error.message,
                  StatusCode: error.StatusCode
            }
      }

        return res.status(error.StatusCode).json(ErrorResponse);
      }
}



module.exports = {
      userSignup
}