import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  sql,
  CreationOptional,
} from '@sequelize/core';
import {
  Attribute,
  AllowNull,
  NotNull,
  Default,
  Table,
  PrimaryKey,
  HasOne,
} from '@sequelize/core/decorators-legacy';
import Faculty from './faculty.model';
import { NonAttribute } from 'sequelize';

@Table({tableName: 'department'})
export default class Department extends Model<
  InferAttributes<Department>,
  InferCreationAttributes<Department>
> {
  @PrimaryKey
  @Default(sql.uuidV4)
  @Attribute(DataTypes.UUID)
  declare id: CreationOptional<string>;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare name: string;
  
  @HasOne(() => Faculty, 'id')
  declare facultyId?: NonAttribute<Faculty>;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare code: string;

  @Attribute(DataTypes.STRING)
  declare description: CreationOptional<string>;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}
