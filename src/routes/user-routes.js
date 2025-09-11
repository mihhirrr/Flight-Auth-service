const express = require('express')
const { UserMiddleware } = require('../middlewares')
const { UserController } = require('../controllers')

const Router = express.Router()

Router.post('/signup', UserMiddleware.Auth, UserController.signup)

Router.post('/login', UserMiddleware.Auth, UserController.login)

module.exports = Router