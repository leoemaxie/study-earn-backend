import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from '@sequelize/core';
import {
  Attribute,
  NotNull,
  PrimaryKey,
  Table,
} from '@sequelize/core/decorators-legacy';

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

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}
