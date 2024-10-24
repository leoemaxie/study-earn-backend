import {
  DataTypes,
  Model,
  sql,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
  CreationOptional,
} from '@sequelize/core';
import {
  Attribute,
  NotNull,
  Default,
  PrimaryKey,
  HasMany,
  Table,
  BeforeSave,
} from '@sequelize/core/decorators-legacy';
import {Role} from './enum';
import {hashPassword} from '@utils/password';
import Payment from './payment.model';
import PaymentMethod from './paymentMethod.model';

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
      is: {
        args: /^[a-z]+@(student\.)?lautech.edu.ng$/,
        msg: 'Invalid school email address',
      },
    },
  })
  declare email: string;

  @Attribute({
    type: DataTypes.STRING(256),
    allowNull: false,
    validate: {
      len: {
        args: [8, 128],
        msg: 'Password must be at least 8 characters',
      },
      is: {
        args: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        msg: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      },
    },
  })
  declare password: string;

  @Attribute({
    type: DataTypes.STRING(32),
    allowNull: false,
    validate: {
      len: {
        args: [3, 32],
        msg: 'First name must be at least 3 characters',
      },
      isAlpha: {
        msg: 'First name must contain only alphabets',
      },
    },
    set(value: string) {
      this.setDataValue(
        'firstName',
        value.replace(/\b\w/g, char => char.toUpperCase())
      );
    },
  })
  declare firstName: string;

  @Attribute({
    type: DataTypes.STRING(32),
    allowNull: false,
    validate: {
      len: {
        args: [3, 32],
        msg: 'Last name must be at least 3 characters',
      },
      isAlpha: {
        msg: 'Last name must contain only alphabets',
      },
    },
    set(value: string) {
      this.setDataValue(
        'lastName',
        value.replace(/\b\w/g, char => char.toUpperCase())
      );
    },
  })
  declare lastName: string;

  @Attribute(DataTypes.STRING)
  declare picture: CreationOptional<string | null>;

  @Attribute({
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: {
      name: 'uniquePhoneNumber',
      msg: 'Phone number already in use',
    },
    validate: {
      is: {
        args: /^(\+234|0)[789](0|1)\d{8}$/,
        msg: 'Invalid phone number provided',
      },
    },
  })
  declare phoneNumber: string;

  @Attribute(DataTypes.BOOLEAN)
  @Default(false)
  declare isVerified: CreationOptional<boolean>;

  @Attribute(DataTypes.DATE)
  declare isBlockedUntil: CreationOptional<Date>;

  @Attribute(DataTypes.TINYINT)
  @Default(0)
  declare loginAttempts: CreationOptional<number>;

  @Attribute(DataTypes.TINYINT)
  @Default(0)
  declare otpAttempts: CreationOptional<number>;

  @Attribute(DataTypes.ENUM(...Object.values(Role)))
  @NotNull
  declare role: string;

  @Attribute(DataTypes.STRING(255))
  declare department: string;

  @HasMany(() => Payment, 'userId')
  declare payments: NonAttribute<Payment[]>;

  @HasMany(() => PaymentMethod, 'userId')
  declare paymentMethods: NonAttribute<PaymentMethod[]>;

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

  @Attribute(DataTypes.DATE)
  @Default(DataTypes.NOW)
  declare lastLogin: CreationOptional<Date>;

  @Attribute(DataTypes.STRING)
  declare gps: CreationOptional<string>;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  @BeforeSave
  static async hashPasswordHook(instance: User) {
    if (instance.changed('password')) {
      instance.password = await hashPassword(instance.password);
    }
  }
}
