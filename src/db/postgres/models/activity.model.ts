import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
  CreationOptional,
} from '@sequelize/core';
import {
  Attribute,
  NotNull,
  BelongsTo,
  AutoIncrement,
  PrimaryKey,
  Table,
} from '@sequelize/core/decorators-legacy';
import User from './user.model';

@Table({tableName: 'activity'})
export default class Activity extends Model<
  InferAttributes<Activity>,
  InferCreationAttributes<Activity>
> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>;

  @Attribute(DataTypes.UUID)
  @NotNull
  declare userId: string;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare type: string;

  @Attribute(DataTypes.STRING)
  declare description: string;

  @Attribute(DataTypes.JSON)
  declare metadata: object;

  @BelongsTo(() => User, {
    foreignKey: 'userId',
    inverse: {
      type: 'hasMany',
      as: 'activities',
    },
  })
  declare user?: NonAttribute<User>;

  declare createdAt: CreationOptional<Date>;
}
