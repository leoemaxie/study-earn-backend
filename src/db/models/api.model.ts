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
  BelongsTo,
} from '@sequelize/core/decorators-legacy';

import School from './school.model';

export default class ApiKey extends Model<
  InferAttributes<ApiKey>,
  InferCreationAttributes<ApiKey>
> {
  @PrimaryKey
  @Default(sql.uuidV4)
  @Attribute(DataTypes.UUID)
  declare id: string;

  @NotNull
  @Attribute(DataTypes.STRING(100))
  declare apiKey: string;

  @Attribute(DataTypes.TEXT)
  declare description: string;

  @NotNull
  @BelongsTo(() => School, 'schoolId')
  declare schoolId: NonAttribute<School>;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}
