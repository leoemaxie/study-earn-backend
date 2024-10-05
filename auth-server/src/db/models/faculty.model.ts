import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  sql,
  CreationOptional,
  NonAttribute,
} from '@sequelize/core';
import {
  Attribute,
  AllowNull,
  Default,
  HasMany,
  Table,
  PrimaryKey,
} from '@sequelize/core/decorators-legacy';
import Course from './course.model';
import Staff from './staff.model';
import Student from './student.model';
import Department from './department.model';

@Table({tableName: 'faculty'})
export default class Faculty extends Model<
  InferAttributes<Faculty>,
  InferCreationAttributes<Faculty>
> {
  @PrimaryKey
  @Default(sql.uuidV4)
  @Attribute(DataTypes.UUID)
  declare id: CreationOptional<string>;

  @Attribute(DataTypes.STRING)
  declare name: string;

  // @HasMany(() => Department,
  // {
  //     foreignKey: 'name',
  //     inverse: {
  //         as: 'faculty',
  //     }
  // })
  // declare departments?: NonAttribute<Department[]>;

  // @HasMany(() => Staff, 'id')

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}
