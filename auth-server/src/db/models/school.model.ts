import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
} from '@sequelize/core';
import {
  Attribute,
  NotNull,
  HasMany,
  PrimaryKey,
  Table,
} from '@sequelize/core/decorators-legacy';
import Staff from './staff.model';
import Student from './student.model';
import Faculty from './faculty.model';

@Table({tableName: 'school'})
export default class School extends Model<
  InferAttributes<School>,
  InferCreationAttributes<School>
> {
  @PrimaryKey
  @Attribute(DataTypes.UUID)
  @NotNull
  declare schoolId: string;

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

  @HasMany(() => Staff, 'id')
  declare staff?: NonAttribute<Staff[]>;

  @HasMany(() => Faculty, 'id')
  declare faculty?: NonAttribute<Faculty[]>;

  @HasMany(() => Student, 'id')
  declare students?: NonAttribute<Student[]>;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}
