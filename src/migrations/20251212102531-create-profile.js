'use strict';
/** @type {import('sequelize-cli').Migration} */


const { Enums } = require('../utils/common-utils')
const { ADMIN, STAFF, CUSTOMER } = Enums.User_Profile;

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Profiles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      Name: {
        type: Sequelize.ENUM,
        values: [ ADMIN, STAFF, CUSTOMER ], 
        allowNull: false,
        default: CUSTOMER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Profiles');
  }
};