import 'dotenv/config';
import {Sequelize} from '@sequelize/core';
import {PostgresDialect} from '@sequelize/postgres';
import User from '@models/user.model';
import School from '@models/school.model';
import Course from '@models/course.model';
import ApiKey from '@models/api.model';
import Student from '@models/student.model';
import Staff from '@models/staff.model';
import Department from '@models/department.model';
import Faculty from '@models/faculty.model';
import Payment from '@models/payment.model';
import PaymentMethod from '@models/payment-method.model';
import Activity from '@models/activity.model';

export async function initializeDatabase() {
  const sequelize = new Sequelize({
    dialect: PostgresDialect,
    url: process.env.DB_URL,
    //ssl: true,
    clientMinMessages: 'notice',
    models: [
      User,
      School,
      Course,
      ApiKey,
      Student,
      Staff,
      Department,
      Faculty,
      Payment,
      PaymentMethod,
      Activity,
    ],
    define: {
      freezeTableName: true,
      underscored: true,
    },
    hooks: {
      beforeSave: trimModelStrings,
      beforeUpdate: trimModelStrings,
      beforeValidate: trimModelStrings,
    },
  });

  return sequelize;
}

interface Model {
  dataValues: Record<string, any>;
  changed: (key: string) => boolean;
}

function trimModelStrings(model: Model): void {
  Object.keys(model.dataValues).forEach(key => {
    if (
      model.dataValues[key] &&
      typeof model.dataValues[key] === 'string' &&
      model.changed(key)
    ) {
      model.dataValues[key] = model.dataValues[key].trim();
    }
  });
}

export default initializeDatabase();
