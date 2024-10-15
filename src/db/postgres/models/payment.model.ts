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
  BelongsTo,
  Table,
} from '@sequelize/core/decorators-legacy';
import {PaymentStatus} from './enum';
import User from './user.model';

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

  @NotNull
  @Attribute(DataTypes.ENUM(...Object.values(PaymentStatus)))
  declare status: string;

  @BelongsTo(() => User, 'id')
  declare user: NonAttribute<User>;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}
