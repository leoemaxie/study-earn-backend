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
  AllowNull,
  NotNull,
  Default,
  HasMany,
  Table,
  PrimaryKey,
} from '@sequelize/core/decorators-legacy';

@Table({tableName: 'department'})
export default class Department extends Model<
  InferAttributes<Department>,
  InferCreationAttributes<Department>
> {
  @PrimaryKey
  @Default(sql.uuidV4)
  @Attribute(DataTypes.UUID)
  declare id: CreationOptional<string>;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare name: string;

  @AllowNull(true)
  @Attribute(DataTypes.STRING)
  declare description: string;

  // @HasMany(() => Course, 'courseId')
  // declare courses?: NonAttribute<Course[]>;

  // @HasMany(() => Staff, 'staffId')
  // declare staff?: NonAttribute<Staff[]>;

  // @HasMany(() => Student, 'studentId')
  // declare students?: NonAttribute<Student[]>;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}
