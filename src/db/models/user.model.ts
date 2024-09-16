import {
  DataTypes,
  Model,
  sql,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from '@sequelize/core';
import {
  Attribute,
  NotNull,
  Default,
  PrimaryKey,
  AllowNull,
} from '@sequelize/core/decorators-legacy';

export default class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  @PrimaryKey
  @Attribute(DataTypes.UUID)
  @Default(sql.uuidV4)
  declare userId: CreationOptional<string>;

  @Attribute(DataTypes.ENUM('student', 'staff', 'admin'))
  @NotNull
  declare userRole: string;

  @Attribute(DataTypes.STRING(255))
  @Default('')
  declare email: CreationOptional<string>;

  @Attribute(DataTypes.STRING(255))
  @NotNull
  declare password: string;

  @Attribute(DataTypes.STRING(255))
  @Default('')
  declare firstName: CreationOptional<string>;

  @Attribute(DataTypes.STRING(255))
  @Default('')
  declare lastName: CreationOptional<string>;

  @Attribute(DataTypes.INTEGER)
  @AllowNull
  declare phoneNumber: number | null;

  @Attribute(DataTypes.DATE)
  @AllowNull
  declare dob: Date | null;

  @Attribute(DataTypes.DATE)
  @AllowNull
  declare joinedAt: Date | null;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  @Attribute(DataTypes.DATE)
  @Default(DataTypes.NOW)
  declare lastLogin: CreationOptional<Date>;
}
