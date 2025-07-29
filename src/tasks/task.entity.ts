import {
  Table,
  Column,
  Model,
  PrimaryKey,
  Default,
  DataType,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { TaskStatus } from './tasks-status.enum';
import { User } from '../auth/user.entity';

@Table({ paranoid: true, timestamps: true })
export class Task extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @Column({ allowNull: false })
  title: string;

  @Column({ allowNull: false })
  description: string;

  @Column({
    type: DataType.ENUM(...Object.values(TaskStatus)),
    allowNull: false,
    defaultValue: TaskStatus.OPEN,
  })
  status: TaskStatus;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  userId: string;

  @BelongsTo(() => User)
  user: User;
}
