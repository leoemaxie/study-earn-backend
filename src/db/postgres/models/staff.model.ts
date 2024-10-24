import {
  DataTypes,
  Model,
  InferAttributes,
  NonAttribute,
  InferCreationAttributes,
  CreationOptional,
  sql,
} from '@sequelize/core';
import {
  Attribute,
  NotNull,
  BelongsTo,
  Table,
  PrimaryKey,
  Default,
} from '@sequelize/core/decorators-legacy';
import User from './user.model';

@Table({tableName: 'staff'})
export default class Staff extends Model<
  InferAttributes<Staff>,
  InferCreationAttributes<Staff>
> {
  @Attribute(DataTypes.UUID)
  @Default(sql.uuidV4)
  @PrimaryKey
  declare id: string;

  @Attribute(DataTypes.UUID)
  @NotNull
  declare userId: string;

  @Attribute(DataTypes.STRING)
  declare position: CreationOptional<string>;

  @Attribute(DataTypes.STRING)
  declare directorate: CreationOptional<string>;

  @BelongsTo(() => User, {
    foreignKey: 'userId',
    inverse: {
      type: 'hasOne',
      as: 'staff',
    },
  })
  declare user?: NonAttribute<User>;
}
