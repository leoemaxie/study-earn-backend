import {
  DataTypes,
  Model,
  NonAttribute,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  sql,
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
  @Default(sql.uuidV4)
  @PrimaryKey
  declare id: string;

  @Attribute(DataTypes.UUID)
  @NotNull
  declare userId: string;

  @BelongsTo(() => User, {
    foreignKey: 'userId',
    inverse: {
      type: 'hasOne',
      as: 'student',
    },
  })
  declare user?: NonAttribute<User>;

  @Attribute(DataTypes.STRING(32))
  declare matricNo: CreationOptional<string>;

  @Attribute(DataTypes.FLOAT)
  @Default(0.0)
  declare cgpa: CreationOptional<number>;

  @Attribute(DataTypes.INTEGER)
  declare level: CreationOptional<number>;

  @Attribute(DataTypes.INTEGER)
  @Default(0)
  declare points: CreationOptional<number>;

  @Attribute(DataTypes.INTEGER)
  declare semester: CreationOptional<number>;
}
