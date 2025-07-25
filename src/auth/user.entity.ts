import {
  Table,
  Column,
  Model,
  PrimaryKey,
  Default,
  DataType,
  HasMany,
} from 'sequelize-typescript';
import { Task } from 'src/tasks/task.entity';

@Table
export class User extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @Column({ allowNull: false })
  declare username: string;

  @Column({ allowNull: false })
  declare password: string;

  @HasMany(() => Task)
  tasks: Task[];
}
