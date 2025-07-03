const express = require('express')
const { UserMiddleware } = require('../middlewares')
const { UserController } = require('../controllers')

const Router = express.Router()

Router.post('/signup', 
      UserMiddleware.Auth, UserController.Signup)

module.exports = Router