'use strict';
const {
  Model
} = require('sequelize');

const { Enums } = require('../utils/common-utils')
const { ADMIN, CUSTOMER } = Enums.User_Profile;

module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsToMany(models.user, {
        through: 'user_profiles',
        foreignKey: 'ProfileId',
      });
    }
  }
  Profile.init({
    Name: DataTypes.ENUM,
    values: [ ADMIN, CUSTOMER ], 
    allowNull: false,
    default: CUSTOMER
  }, 
  {
    sequelize,
    modelName: 'Profile',
  });
  return Profile;
};