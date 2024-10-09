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
  Default,
  Table,
  PrimaryKey,
} from '@sequelize/core/decorators-legacy';

@Table({tableName: 'faculty'})
export default class Faculty extends Model<
  InferAttributes<Faculty>,
  InferCreationAttributes<Faculty>
> {
  @PrimaryKey
  @Default(sql.uuidV4)
  @Attribute(DataTypes.UUID)
  declare id: CreationOptional<string>;

  @Attribute(DataTypes.STRING(256))
  declare name: string;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}
