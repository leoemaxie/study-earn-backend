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
  Table,
} from '@sequelize/core/decorators-legacy';
import {PaymentStatus} from './enum';

@Table({tableName: 'payment'})
export default class Payment extends Model<
  InferAttributes<Payment>,
  InferCreationAttributes<Payment>
> {
  @PrimaryKey
  @Attribute(DataTypes.UUID)
  @Default(sql.uuidV4)
  declare id: CreationOptional<string>;

  @Attribute({
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: {
        args: [1000],
        msg: 'Amount must be greater than 0',
      },
      max: {
        args: [1000000],
        msg: 'Amount must be less than 1000000',
      },
    },
  })
  declare amount: number;

  @Attribute(DataTypes.ENUM(...Object.values(PaymentStatus)))
  @NotNull
  declare status: string;

  @Attribute(DataTypes.UUID)
  @NotNull
  declare userId: string;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare transactionReference: string;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare paymentReference: string;

  @Attribute(DataTypes.DATE)
  @NotNull
  declare paidOn: Date;

  @Attribute(DataTypes.STRING)
  declare paymentDescription?: string;

  @Attribute(DataTypes.UUID)
  declare receiver?: CreationOptional<string>;
}
