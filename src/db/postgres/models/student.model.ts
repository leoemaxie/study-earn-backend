import {
  DataTypes,
  Model,
  NonAttribute,
  InferAttributes,
  InferCreationAttributes,
} from '@sequelize/core';
import {
  Attribute,
  NotNull,
  Default,
  BelongsTo,
  HasOne,
  Table,
  PrimaryKey,
} from '@sequelize/core/decorators-legacy';
import User from './user.model';
import Course from './course.model';
import Department from './department.model';
import { CreationOptional } from 'sequelize';

@Table({tableName: 'student'})
export default class Student extends Model<
  InferAttributes<Student>,
  InferCreationAttributes<Student>
> {
  @Attribute(DataTypes.UUID)
  @PrimaryKey
  declare id: string;

  @BelongsTo(() => User, 'role')
  declare user?: NonAttribute<User>;

  @HasOne(() => Department, 'id')
  declare department?: NonAttribute<Department[]>;

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare matricNo: number;

  @Attribute(DataTypes.FLOAT)
  @Default(0.0)
  declare cgpa: number;

  @Attribute(DataTypes.INTEGER)
  declare level: CreationOptional<number>;

  @Attribute(DataTypes.INTEGER)
  declare points: CreationOptional<number>;

  @Attribute(DataTypes.INTEGER)
  declare semester: CreationOptional<number>;
}
