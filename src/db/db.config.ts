import {Sequelize} from '@sequelize/core';
import {PostgresDialect} from '@sequelize/postgres';
import User from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize({
  dialect: PostgresDialect,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: 5432,
  //ssl: true,
  clientMinMessages: 'notice',
  models: [User],
});

export default sequelize;
