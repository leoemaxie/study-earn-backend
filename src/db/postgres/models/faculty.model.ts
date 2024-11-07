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
  Default,
  Table,
  PrimaryKey,
  HasMany,
} from '@sequelize/core/decorators-legacy';
import Department from './department.model';

@Table({tableName: 'faculty'})
export default class Faculty extends Model<
  InferAttributes<Faculty>,
  InferCreationAttributes<Faculty>
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

  @Attribute(DataTypes.TEXT)
  declare description: CreationOptional<string>

  @HasMany(() => Department, {
    foreignKey: {
      name: 'facultyId',
      onDelete: 'SET NULL',
    }
  })
  declare departments?: NonAttribute<Department[]>;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}
