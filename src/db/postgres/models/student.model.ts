import {
  DataTypes,
  Model,
  NonAttribute,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from '@sequelize/core';
import {
  Attribute,
  NotNull,
  Default,
  BelongsTo,
  Table,
  PrimaryKey,
} from '@sequelize/core/decorators-legacy';
import User from './user.model';

@Table({tableName: 'student'})
export default class Student extends Model<
  InferAttributes<Student>,
  InferCreationAttributes<Student>
> {
  @Attribute(DataTypes.UUID)
  @PrimaryKey
  declare id: string;

  @BelongsTo(() => User, 'role')
  declare user?: NonAttribute<User>;

  @Attribute(DataTypes.STRING(32))
  @NotNull
  declare matricNo: number;

  @Attribute(DataTypes.FLOAT)
  @Default(0.0)
  declare cgpa: number;

  @Attribute(DataTypes.INTEGER)
  declare level: CreationOptional<number>;

  @Attribute(DataTypes.INTEGER)
  declare points: CreationOptional<number>;

  @Attribute(DataTypes.INTEGER)
  declare semester: CreationOptional<number>;
}
