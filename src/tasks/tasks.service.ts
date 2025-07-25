import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './tasks-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Op } from 'sequelize';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task)
    private readonly tasksModel: typeof Task,
  ) {}

  async getAllTasks(): Promise<Task[]> {
    return this.tasksModel.findAll({
      raw: true, // <-- returns plain objects
      nest: true, // <-- nests include results properly
    });
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.tasksModel.create({
      title: createTaskDto.title,
      description: createTaskDto.description,
      status: TaskStatus.OPEN,
      userId: user.id,
    });
  }

  async getTaskById(id: string): Promise<Task> {
    const task = await this.tasksModel.findByPk(id);
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);
    task.status = status;
    await task.save();
    return task;
  }

  async deleteTask(id: string): Promise<void> {
    const task = await this.getTaskById(id);
    await task.destroy();
    console.log(`Task with ID ${id} deleted successfully`);
  }

  async deleteAllTasks(): Promise<void> {
    await this.tasksModel.destroy({ where: {}, truncate: true });
    console.log('All tasks deleted successfully');
  }

  async getTasksByFilterAndSearch(
    filterDto: GetTasksFilterDto,
  ): Promise<Task[]> {
    const { status, search } = filterDto;
    const query: any = { where: {} };

    if (status) {
      query.where.status = status;
    }

    if (search) {
      query.where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }

    return this.tasksModel.findAll({
      where: query.where, // or your filter conditions
      attributes: ['id', 'title', 'description', 'status'],
    });
  }
}
