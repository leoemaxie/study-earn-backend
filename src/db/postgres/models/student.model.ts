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

  @Attribute({
    type: DataTypes.FLOAT,
    defaultValue: 0.0,
    validate: {
      min: {
        args: [0.0],
        msg: 'CGPA must be greater than or equal to 0.0',
      },
      max: {
        args: [5.0],
        msg: 'CGPA must be less than or equal to 5.0',
      },
    },
  })
  declare cgpa: CreationOptional<number>;

  @Attribute(DataTypes.ENUM('100', '200', '300', '400', '500'))
  declare level: CreationOptional<string>;

  @Attribute(DataTypes.INTEGER)
  @Default(0)
  declare points: CreationOptional<number>;

  @Attribute({
    type: DataTypes.INTEGER,
    validate: {
      isIn: {
        args: [[1, 2]],
        msg: 'Semester must be either 1 or 2',
      },
    },
  })
  declare semester: CreationOptional<number>;
}
