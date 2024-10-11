import {Sequelize, importModels} from '@sequelize/core';
import {PostgresDialect} from '@sequelize/postgres';
import User from './models/user.model';
import School from './models/school.model';
import Course from './models/course.model';
import ApiKey from './models/api.model';
import Student from './models/student.model';
import Staff from './models/staff.model';
import Department from './models/department.model';

import dotenv from 'dotenv';
import Faculty from './models/faculty.model';

dotenv.config();

export async function initializeDatabase() {
  return new Sequelize({
    dialect: PostgresDialect,
    url: process.env.DB_URL,
    //ssl: true,
    clientMinMessages: 'notice',
    models: [User, School, Course, ApiKey, Student, Staff, Department, Faculty],
    // models: await importModels(__dirname + './models/*.model.ts'),
    define: {
      freezeTableName: true,
      underscored: true,
    },
  });
}

export default initializeDatabase();
