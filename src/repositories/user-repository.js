const CrudFunctions = require('./crud-repository')
const { User } = require('../models')

class UserRepository extends CrudFunctions {
      constructor(){
            super(User)
      }
}

module.exports = UserRepository;