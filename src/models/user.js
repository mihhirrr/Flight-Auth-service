'use strict';
const {
  Model
} = require('sequelize');

const bcrypt = require('bcrypt');
const { ServerConfig } = require('../config')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.belongsToMany(models.profile, {
        through: 'user_profiles',
        foreignKey: 'UserId',
      });      
    }
  }
  User.init({
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate:{
        isEmail: true,
        notEmpty: true,
        notNull: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        notEmpty: true,
        notNull: true
      }
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