const { UserService } = require("../services");
const { StatusCodes } = require("http-status-codes");
const { Error, Success } = require("../utils/common-utils");

async function Signup(req, res, next) {
      const { email, password, DoB } = req.body;
    
      try {
        const createdUser = await UserService.userSignup({
            email,
            password,
            DoB
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

        return res.status(error.StatusCode || 500 ).json(ErrorResponse);
      }
}


module.exports = {
      Signup
}