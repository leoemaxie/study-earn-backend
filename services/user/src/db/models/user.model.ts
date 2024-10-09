import {
  DataTypes,
  Model,
  sql,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
} from '@sequelize/core';
import {
  Attribute,
  NotNull,
  Default,
  PrimaryKey,
  Table,
  Unique,
} from '@sequelize/core/decorators-legacy';
import {Role} from './enum/role';

@Table({tableName: 'users'})
export default class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  @PrimaryKey
  @Attribute(DataTypes.UUID)
  @Default(sql.uuidV4)
  declare id: CreationOptional<string>;

  @Attribute(DataTypes.ENUM(...Object.values(Role)))
  @NotNull
  declare role: string;

  @Attribute(DataTypes.STRING(255))
  @NotNull
  @Unique
  declare email: string;

  @Attribute({
    type: DataTypes.STRING(255),
    defaultValue: '',
    validate: {
      min: {
        args: [3],
        msg: 'First name must be at least 3 characters',
      },
    },
  })
  declare firstName: CreationOptional<string>;

  @Attribute({
    type: DataTypes.STRING(255),
    defaultValue: '',
    validate: {
      min: {
        args: [3],
        msg: 'Last name must be at least 3 characters',
      },
    },
  })
  declare lastName: CreationOptional<string>;

  @Attribute(DataTypes.DATE)
  declare dob: CreationOptional<Date>;

  @Attribute({
    type: DataTypes.DATE,
    validate: {
      isBefore: {
        args: new Date().toISOString(),
        msg: 'Invalid date provided',
      },
    },
  })
  declare joinedAt: CreationOptional<Date>;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  @Attribute({
    type: DataTypes.INTEGER,
    validate: {
      is: {
        args: /^(\+234|0)[789]\d{9}$/,
        msg: 'Invalid phone number provided',
      },
    },
  })
  declare phoneNumber: CreationOptional<number>;

  @Attribute(DataTypes.DATE)
  @Default(DataTypes.NOW)
  declare lastLogin: CreationOptional<Date>;
}
