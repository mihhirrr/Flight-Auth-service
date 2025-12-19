'use strict';
const {
  Model
} = require('sequelize');

const { Enums } = require('../utils/common-utils')
const { ADMIN, CUSTOMER } = Enums.User_Profile;

module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {

    static associate(models) {
      this.belongsToMany(models.User, {
        through: 'user_profiles',
        foreignKey: 'ProfileId',
      });
    }
  }
  Profile.init({
    Name: {
      type: DataTypes.ENUM,
      values: [ ADMIN, CUSTOMER ],
      allowNull: false,
      default: CUSTOMER
    }, 
  }, 
  {
    sequelize,
    modelName: 'Profile',
  });
  return Profile;
};