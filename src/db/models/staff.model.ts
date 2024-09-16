import {
  DataTypes,
  Model,
  InferAttributes,
  NonAttribute,
  InferCreationAttributes,
} from '@sequelize/core';
import {Attribute, NotNull, BelongsTo} from '@sequelize/core/decorators-legacy';
import User from './user.model';
import School from './school.model';

export default class Staff extends Model<
  InferAttributes<Staff>,
  InferCreationAttributes<Staff>
> {
  @Attribute(DataTypes.UUID)
  @NotNull
  declare staffId: string;

  @Attribute(DataTypes.UUID)
  @NotNull
  declare schoolId: string;

  @BelongsTo(() => User, 'staffId')
  declare user?: NonAttribute<User>;

  @BelongsTo(() => School, 'schoolId')
  declare school?: NonAttribute<School>;
}
