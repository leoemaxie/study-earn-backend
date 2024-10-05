import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  sql,
  NonAttribute,
  CreationOptional,
} from '@sequelize/core';
import {
  Attribute,
  NotNull,
  Default,
  BelongsTo,
} from '@sequelize/core/decorators-legacy';
import Staff from './staff.model';

export default class Admin extends Model<
  InferAttributes<Admin>,
  InferCreationAttributes<Admin>
> {
  @Attribute(DataTypes.UUID)
  @Default(sql.uuidV4)
  @NotNull
  declare adminId: CreationOptional<string>;

  @BelongsTo(() => Staff, 'id')
  declare staff?: NonAttribute<Staff>;
}
