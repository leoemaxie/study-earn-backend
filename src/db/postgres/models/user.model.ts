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
  BeforeSave,
  BelongsTo,
  Table,
} from '@sequelize/core/decorators-legacy';
import {Role} from './enum/role';
import {hashPassword} from '../../../utils/hashPassword';

@Table({tableName: 'users'})
export default class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  @PrimaryKey
  @Attribute(DataTypes.UUID)
  @Default(sql.uuidV4)
  declare id: CreationOptional<string>;

  @Attribute({
    type: DataTypes.STRING(255),
    unique: true,
    allowNull: false,
    validate: {
      isEmail: {
        msg: 'Invalid email',
      },
    },
  })
  declare email: string;

  @Attribute({
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      len: {
        args: [8, 255],
        msg: 'Password must be at least 8 characters',
      },
      is: {
        args: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/,
        msg: 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
      },
    },
  })
  declare password: string;

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
  declare firstName: string;

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
  declare lastName: string;

  @Attribute(DataTypes.DATE)
  declare dob: CreationOptional<Date>;

  @Attribute(DataTypes.ENUM(...Object.values(Role)))
  @NotNull
  declare role: string;

  @Attribute({
    type: DataTypes.DATE,
    validate: {
      isBefore: {
        args: new Date().toISOString(),
        msg: 'Invalid date provided',
      },
    },
  })
  @Attribute(DataTypes.STRING(255))
  declare department: string;

  declare joinedAt: CreationOptional<Date>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  @Attribute({
    type: DataTypes.STRING(20),
    validate: {
      is: {
        args: /^(\+234|0)[789]\d{9}$/,
        msg: 'Invalid phone number provided',
      },
    },
  })
  declare phoneNumber: string;

  @Attribute(DataTypes.DATE)
  @Default(DataTypes.NOW)
  declare lastLogin: CreationOptional<Date>;

  @BeforeSave
  static async hashPassword(user: User) {
    if (user.changed('password')) {
      user.password = await hashPassword(user.password);
    }
  }
}