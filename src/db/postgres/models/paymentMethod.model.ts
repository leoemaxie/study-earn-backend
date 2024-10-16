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
  Default,
  PrimaryKey,
  NotNull,
  Table,
} from '@sequelize/core/decorators-legacy';

@Table({tableName: 'payment_method'})
export default class PaymentMethod extends Model<
  InferAttributes<PaymentMethod>,
  InferCreationAttributes<PaymentMethod>
> {
  @PrimaryKey
  @Attribute(DataTypes.UUID)
  @Default(sql.uuidV4)
  declare id: CreationOptional<string>;

  @Attribute({
    type: DataTypes.STRING(10),
    allowNull: false,
    validate: {
      len: {
        args: [10, 10],
        msg: 'Account number must be 10 digits',
      },
    },
  })
  declare accountNumber: string;

  @Attribute({
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      len: {
        args: [5, 255],
        msg: 'Account name must be at least 5 characters',
      },
      is: {
        args: /^[a-zA-Z\s]+$/,
        msg: 'Invalid account name',
      },
    },
  })
  declare accountName: string;

  @Attribute({
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      len: {
        args: [5, 255],
        msg: 'Bank name must be at least 5 characters',
      },
      is: {
        args: /^[a-zA-Z\s]+$/,
        msg: 'Invalid bank name',
      },
    },
  })
  declare bankName: string;

  @Attribute(DataTypes.UUID)
  @NotNull
  declare userId: string;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}
