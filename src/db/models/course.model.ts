import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  sql,
  NonAttribute,
} from '@sequelize/core';
import {
  Attribute,
  PrimaryKey,
  Default,
  NotNull,
  BelongsToMany,
} from '@sequelize/core/decorators-legacy';
import Staff from './staff.model';

export default class Course extends Model<
  InferAttributes<Course>,
  InferCreationAttributes<Course>
> {
  @PrimaryKey
  @Default(sql.uuidV4)
  @Attribute(DataTypes.UUID)
  declare courseId: string;

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

  @BelongsToMany(() => Staff, {
    through: () => StaffCourse,
  })
  declare staff?: NonAttribute<Staff[]>;

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
