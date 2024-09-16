import {
  DataTypes,
  Model,
  NonAttribute,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from '@sequelize/core';
import {
  Attribute,
  NotNull,
  Default,
  BelongsTo,
  HasOne,
  HasMany,
} from '@sequelize/core/decorators-legacy';
import User from './user.model';
import Course from './course.model';

export default class Student extends Model<
  InferAttributes<Student>,
  InferCreationAttributes<Student>
> {
  @Attribute(DataTypes.UUID)
  @NotNull
  declare studentId: string;

  @Attribute(DataTypes.UUID)
  @NotNull
  declare schoolId: string;

  @BelongsTo(() => User, 'studentId')
  declare user?: NonAttribute<User>;

  @HasMany(() => Course, 'courseId')
  declare courses?: NonAttribute<Course[]>;

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare matricNo: number;

  @Attribute(DataTypes.INTEGER)
  @Default(0)
  declare cgpa: number;
}
