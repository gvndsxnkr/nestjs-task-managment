import { Injectable, NotFoundException } from '@nestjs/common';
import { TasksRepository } from './tasks.repository';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './task.entity';
import { TaskStatus } from './tasks-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  constructor(private readonly tasksRepository: TasksRepository) {}

  getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    return this.tasksRepository.getTasks(filterDto);
  }

  // private tasks: Task[] = [];
  // getAllTasks(): Task[] {
  //   return this.tasks;
  // }
  //
  // getTasksWithFlters(filterDto: GetTasksFilterDto): Task[] {
  //   const { status, search } = filterDto;
  //   //define a tem array to hold the tasks
  //   let tasks = this.getAllTasks();
  //   if (status) {
  //     tasks = tasks.filter((task) => task.status === status);
  //   }
  //   if (search) {
  //     tasks = tasks.filter((task) => {
  //       if (task.title.includes(search) || task.description.includes(search)) {
  //         return true;
  //       }
  //       return false;
  //     });
  //   }
  //   //retun final result
  //   return tasks;
  // }

  async getAllTasks(): Promise<Task[]> {
    return this.tasksRepository.getAllTasks();
  }

  async getTaskById(id: string): Promise<Task> {
    const found = await this.tasksRepository.getTaskById(id);
    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return found;
  }

  // getTaskById(id: string): Task {
  //   const found = this.tasks.find((task) => task.id === id);
  //   if (!found) {
  //     throw new NotFoundException(`Task with ID "${id}" not found`);
  //   }
  //   return found;
  // }

  async deleteTaskById(id: string): Promise<string> {
    return await this.tasksRepository.deleteTaskById(id);
  }
  // deleteTaskById(id: string): void {
  //   //this.tasks = this.tasks.filter((task) => task.id !== id);
  //   // const index = this.tasks.findIndex((task) => task.id === id);
  //   // const deletedTask = this.tasks.splice(index, 1)[0];
  //   // return deletedTask;
  //   const found = this.getTaskById(id);
  //   this.tasks = this.tasks.filter((task) => task.id !== found.id);
  // }
  //
  // updateTaskStatusById(id: string, status: TaskStatus): Task {
  //   const task = this.getTaskById(id);
  //   task.status = status;
  //   return task;
  // }

  updateTaskStatusById(id: string, status: TaskStatus): Promise<Task> {
    return this.tasksRepository.updateTaskStatusById(id, status);
  }

  // createTask(createTaskDto: CreateTaskDto): Task {
  //   const { title, description } = createTaskDto;
  //   const task: Task = {
  //     id: uuid(),
  //     title,
  //     description,
  //     status: TaskStatus.OPEN,
  //   };
  //   this.tasks.push(task);
  //   return task;
  // }

  createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto);
  }
}
