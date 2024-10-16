import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  sql,
  NonAttribute,
} from '@sequelize/core';
import {
  Attribute,
  PrimaryKey,
  Default,
  NotNull,
  Table,
  BelongsToMany,
} from '@sequelize/core/decorators-legacy';
import Staff from './staff.model';

@Table({tableName: 'course'})
export default class Course extends Model<
  InferAttributes<Course>,
  InferCreationAttributes<Course>
> {
  @PrimaryKey
  @Default(sql.uuidV4)
  @Attribute(DataTypes.UUID)
  declare id: string;

  @Attribute({
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      len: {
        args: [3, 255],
        msg: 'Name must be at least 3 characters',
      },
      isAlpha: {
        msg: 'Name must only contain alphabets',
      },
    },
  })
  declare name: string;

  @Attribute({
    type: DataTypes.STRING(10),
    allowNull: false,
    validate: {
      len: {
        args: [3, 10],
        msg: 'Code must be at least 3 characters',
      },
      isAlphanumeric: {
        msg: 'Code must only contain alphabets and numbers',
      },
    },
    set(value: string) {
      this.setDataValue('code', value.toUpperCase());
    },
  })
  declare code: string;

  @Attribute(DataTypes.TEXT)
  declare description: CreationOptional<string>;

  @Attribute(DataTypes.INTEGER)
  @NotNull
  declare unit: number;

  // @BelongsToMany(() => Staff, {
  //   through: () => StaffCourse,
  // })
  // declare staff?: NonAttribute<Staff[]>;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

class StaffCourse extends Model<
  InferAttributes<StaffCourse>,
  InferCreationAttributes<StaffCourse>
> {
  declare staffId: string;
  declare courseId: string;
}
