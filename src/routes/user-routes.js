const express = require('express')
const { UserMiddleware } = require('../middlewares')
const { UserController } = require('../controllers')

const Router = express.Router()

Router.post('/signup', UserMiddleware.Auth, UserController.signup)

Router.post('/login', UserController.login)

module.exports = Router