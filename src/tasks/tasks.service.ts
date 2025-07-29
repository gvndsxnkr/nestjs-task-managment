import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './tasks-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Op, where } from 'sequelize';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task) private tasksModel: typeof Task) {}

  async getAllTasks(user: User): Promise<Task[]> {
    return this.tasksModel.findAll({
      where: { userId: user.id },
      attributes: ['id', 'title', 'description', 'status'],
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

  async getTaskById(id: string, user: User): Promise<Task> {
    const task = await this.tasksModel.findOne({
      where: { id, userId: user.id },
    });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async updateTaskStatus(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    try {
      const task = await this.getTaskById(id, user);
      if (!task) {
        throw new Error('Task not found');
      }
      task.status = status;
      await task.update({ status }, { where: { id } });
      return task;
    } catch (error) {
      console.error('Failed to update task status:', error);
      throw error; // or handle error as needed
    }
  }

  async deleteTask(id: string, user: User): Promise<void> {
    try {
      const task = await this.getTaskById(id, user);
      console.log(`Task found: ${task.title}`); // Debugging line
      console.log(`Deleting task with ID: ${id}`); // Debugging line
      await task.destroy();

      console.log(`Task with ID ${id} deleted successfully`);
    } catch (error) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }

  async deleteAllTasks(user: User): Promise<void> {
    await this.tasksModel.destroy({ where: {}, truncate: true });
    // console.log('All tasks deleted successfully');
  }

  async getTasksByFilterAndSearch(
    filterDto: GetTasksFilterDto,
    user: User,
  ): Promise<Task[]> {
    const { status, search } = filterDto;
    const query: any = { where: { userId: user.id } };

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
