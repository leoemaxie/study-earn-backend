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
  Table,
  BelongsToMany,
} from '@sequelize/core/decorators-legacy';

export default class Order extends Model<
  InferAttributes<Order>,
  InferCreationAttributes<Order>
> {
  @PrimaryKey
  @Default(sql.uuidV4)
  @Attribute(DataTypes.UUID)
  declare id: string;
}
