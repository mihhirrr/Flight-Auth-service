const CrudFunctions = require('./crud-repository')
const { Profile } = require('../models');

class ProfileRepository extends CrudFunctions {
      constructor(){
            super(Profile)
      }
      async findOne(pro){
           const foundProfile = await Profile.findOne({
            where:{
                  Name:pro
            }
           })
           return foundProfile
      }
}

module.exports = ProfileRepository;