'use strict';

/** @type {import('sequelize-cli').Migration} */

//Seeding the User profiles manually as there won't be regular changes in profile.
module.exports = {
  async up (queryInterface, Sequelize) {
      await queryInterface.bulkInsert('profiles', [{  
        Name: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Name: 'customer',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('profiles', null, {});
  }
};
