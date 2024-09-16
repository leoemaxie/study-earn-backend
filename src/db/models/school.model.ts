import {
  DataTypes,
  Model,
  InferAttributes,
  sql,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
} from '@sequelize/core';
import {
  Attribute,
  NotNull,
  Default,
  HasMany,
  PrimaryKey,
} from '@sequelize/core/decorators-legacy';
import Department from './department.model';
import Staff from './staff.model';
import Student from './student.model';

export default class School extends Model<
  InferAttributes<School>,
  InferCreationAttributes<School>
> {
  @PrimaryKey
  @Attribute(DataTypes.UUID)
  @Default(sql.uuidV4)
  declare schoolId: CreationOptional<string>;

  @NotNull
  @Attribute(DataTypes.STRING)
  declare name: string;

  @Attribute(DataTypes.STRING)
  declare city: string;

  @Attribute(DataTypes.STRING)
  declare state: string;

  @Attribute(DataTypes.ENUM('state', 'private', 'federal'))
  declare type: string;

  @Attribute(DataTypes.STRING)
  declare website: string;

  @HasMany(() => Staff, 'schoolId')
  declare staff?: NonAttribute<Staff[]>;

  @HasMany(() => Department, 'departmentId')
  declare departments?: NonAttribute<Department[]>;

  @HasMany(() => Student, 'studentId')
  declare students?: NonAttribute<Student[]>;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}
