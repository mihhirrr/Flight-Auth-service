'use strict';

/** @type {import('sequelize-cli').Migration} */

//Migrating constraints to create M:M relationships between users and profiles tables through user_profiles
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint('user_profiles', {
      type: 'foreign key',
      fields: ['UserId'],
      name: 'users_FK',
      references: {
        table: 'users',
        field: 'id'
      },
      onUpdate:'CASCADE', 
      onDelete:'CASCADE'
    }) 

    await queryInterface.addConstraint('user_profiles', {
      type: 'foreign key',
      fields: ['ProfileId'],
      name: 'profiles_FK',
      references: {
        table: 'profiles',
        field: 'id'
      },
      onUpdate:'CASCADE', 
      onDelete:'CASCADE'
    })  
  },

// For reverting the constraints (sequelize migration:undo)
  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('user_profiles','users_FK');
    await queryInterface.removeConstraint('user_profiles','profiles_FK')
  }
};
