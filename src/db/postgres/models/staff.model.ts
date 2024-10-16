import {
  DataTypes,
  Model,
  InferAttributes,
  NonAttribute,
  InferCreationAttributes,
} from '@sequelize/core';
import {
  Attribute,
  NotNull,
  BelongsTo,
  Table,
  PrimaryKey,
} from '@sequelize/core/decorators-legacy';
import User from './user.model';

@Table({tableName: 'staff'})
export default class Staff extends Model<
  InferAttributes<Staff>,
  InferCreationAttributes<Staff>
> {
  @Attribute(DataTypes.UUID)
  @PrimaryKey
  @NotNull
  declare id: string;

  @Attribute(DataTypes.UUID)
  @NotNull
  declare userId: string;

 
  @BelongsTo(() => User, {
    foreignKey: 'userId',
    inverse: {
      type: 'hasOne',
      as: 'staff',
    },
  })
  declare user?: NonAttribute<User>;
}
