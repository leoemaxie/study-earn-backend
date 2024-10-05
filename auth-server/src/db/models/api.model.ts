import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  sql,
} from '@sequelize/core';
import {
  Attribute,
  PrimaryKey,
  Default,
  NotNull,
  BelongsTo,
  Table,
} from '@sequelize/core/decorators-legacy';

@Table({tableName: 'api_key'})
export default class ApiKey extends Model<
  InferAttributes<ApiKey>,
  InferCreationAttributes<ApiKey>
> {
  @PrimaryKey
  @Default(sql.uuidV4)
  @Attribute(DataTypes.UUID)
  declare id: CreationOptional<string>;

  @NotNull
  @Attribute(DataTypes.STRING(256))
  declare apiKey: string;

  @NotNull
  @Attribute(DataTypes.STRING(256))
  declare apiSecrets: string;

  @NotNull
  @Default(sql.uuidV4)
  @Attribute(DataTypes.UUID)
  declare schoolId: CreationOptional<string>;

  @Attribute(DataTypes.TEXT)
  declare description: string;

  @Attribute(DataTypes.INTEGER)
  @Default(100)
  declare rateLimit: number;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}
