const express = require('express')
const { UserMiddleware } = require('../middlewares')
const { UserController } = require('../controllers')

const Router = express.Router()

Router.post(
      '/users/signup', 
      UserMiddleware.Auth, 
      UserController.signup
)

Router.post(
      '/admin/members', 
      UserMiddleware.Auth, 
      UserMiddleware.isAdmin,
      UserController.addstaff
)

Router.post(
      '/users/login',
       UserMiddleware.Auth, 
       UserController.login
)

module.exports = Router