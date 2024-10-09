import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  sql,
} from '@sequelize/core';
import {
  Attribute,
  PrimaryKey,
  Default,
  NotNull,
  Table,
} from '@sequelize/core/decorators-legacy';

@Table({tableName: 'course'})
export default class Course extends Model<
  InferAttributes<Course>,
  InferCreationAttributes<Course>
> {
  @PrimaryKey
  @Default(sql.uuidV4)
  @Attribute(DataTypes.UUID)
  declare id: string;

  @NotNull
  @Attribute(DataTypes.STRING(100))
  declare courseCode: string;

  @NotNull
  @Attribute(DataTypes.STRING(255))
  declare courseName: string;

  @Attribute(DataTypes.TEXT)
  declare description: string;

  @NotNull
  @Attribute(DataTypes.INTEGER)
  declare credits: number;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

class StaffCourse extends Model<
  InferAttributes<StaffCourse>,
  InferCreationAttributes<StaffCourse>
> {
  declare staffId: string;
  declare courseId: string;
}
