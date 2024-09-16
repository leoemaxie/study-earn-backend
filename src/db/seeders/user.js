
'use strict';

const { faker } = require('@faker-js/faker');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Create schools first
    const schools = [];
    const numSchools = 5;

    for (let i = 0; i < numSchools; i++) {
      schools.push({
        id: Sequelize.literal('uuid_generate_v4()'),
        name: faker.company.companyName(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    await queryInterface.bulkInsert('Schools', schools, {});

    // Create users with foreign key references to schools
    const users = [];
    const numUsers = 50;

    for (let i = 0; i < numUsers; i++) {
      users.push({
        id: Sequelize.literal('uuid_generate_v4()'),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        schoolId: faker.helpers.randomize(schools.map(school => school.id)), // Assign random school
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    await queryInterface.bulkInsert('Users', users, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
    await queryInterface.bulkDelete('Schools', null, {});
  }
};
