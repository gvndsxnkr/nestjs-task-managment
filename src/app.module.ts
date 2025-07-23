import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';

import { AuthModule } from './auth/auth.module';
import { SequelizeModule } from '@nestjs/sequelize';
@Module({
  imports: [
    SequelizeModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'task-management',
      autoLoadEntities: true,
      synchronize: true,
    }),
    TasksModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
