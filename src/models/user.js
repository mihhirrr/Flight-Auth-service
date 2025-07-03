'use strict';
const {
  Model
} = require('sequelize');

const bcrypt = require('bcrypt');
const { ServerConfig } = require('../config')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    DoB: {
      type: DataTypes.DATEONLY,
    }
  }, {
    sequelize,
    modelName: 'User',

    //Converting the provided pass to an hashed one before inserting..
    hooks: {
      beforeCreate: async (user) => {
        const hash = await bcrypt.hash(user.password, parseInt(ServerConfig.SALT_ROUNDS));
        user.password = hash;
      },
      beforeUpdate: async (user) => {
        const hash = await bcrypt.hash(user.password, parseInt(ServerConfig.SALT_ROUNDS));
        user.password = hash;
      },
    }
    
  });

  return User;
};