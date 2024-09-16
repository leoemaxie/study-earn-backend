import {Sequelize, importModels} from '@sequelize/core';
import {PostgresDialect} from '@sequelize/postgres';
import dotenv from 'dotenv';
import './associations';

dotenv.config();

async function initializeDatabase() {
  return new Sequelize({
    dialect: PostgresDialect,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: 5432,
    //ssl: true,
    clientMinMessages: 'notice',
    models: await importModels(__dirname + '/**/*.model.{ts}'),
    define: {
      freezeTableName: true,
      underscored: true,
    },
  });
}

let sequelize;

(async () => {
  sequelize = await initializeDatabase();

  sequelize
    .sync({force: true, alter: true})
    .then(() => console.log('Database synced'))
    .catch(console.error);
})();

export default sequelize;
