'use strict';

import {faker} from '@faker-js/faker';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let users = [];
    for (let i = 0; i < 50; i++) {
      users.push({
        // Alternate between using uuid_generate_v4() and the default postgres UUID generation
        id: i % 2 === 0 ? faker.string.uuid() : null,
        role: faker.helpers.arrayElement(['student', 'staff', 'admin']),
        email: faker.internet.email(),
        password: faker.internet.password(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        phoneNumber: faker.phone.number(),
        dob: faker.date.past({years: 18}),
        joinedAt: faker.date.past({years: 1}),
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLogin: faker.date.recent(),
      });
    }

    await queryInterface.bulkInsert('Users', users, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
