import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  sql,
  CreationOptional,
  NonAttribute,
} from '@sequelize/core';
import {
  Attribute,
  NotNull,
  Default,
  Table,
  PrimaryKey,
  HasOne,
  HasMany,
  BelongsTo,
} from '@sequelize/core/decorators-legacy';
import Faculty from './faculty.model';
import Course from './course.model';

@Table({tableName: 'department'})
export default class Department extends Model<
  InferAttributes<Department>,
  InferCreationAttributes<Department>
> {
  @PrimaryKey
  @Default(sql.uuidV4)
  @Attribute(DataTypes.UUID)
  declare id: CreationOptional<string>;

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
    set(value: string) {
      this.setDataValue(
        'name',
        value.replace(/\b\w/g, char => char.toUpperCase())
      );
    },
  })
  declare name: string;

  @Attribute(DataTypes.UUID)
  @NotNull
  declare facultyId: string;

  @HasMany(() => Course, 'id')
  declare courses?: NonAttribute<Course[]>;

  @Attribute({
    type: DataTypes.STRING(10),
    allowNull: false,
    validate: {
      len: {
        args: [3, 10],
        msg: 'Code must be at least 3 characters',
      },
      isAlpha: {
        msg: 'Code must only contain alphabets',
      },
    },
    set(value: string) {
      this.setDataValue('code', value.toUpperCase());
    },
  })
  declare code: string;

  @Attribute(DataTypes.TEXT)
  declare description: CreationOptional<string>;

  @BelongsTo(() => Faculty, 'facultyId')
  declare faculty?: NonAttribute<Faculty>;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}
