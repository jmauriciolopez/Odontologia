import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { RemindersService } from './reminders.service';
import { Turno } from '../turnos/entities/turno.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Turno]),
    ScheduleModule.forRoot(), // Habilita el programador de tareas
  ],
  providers: [RemindersService],
})
export class RemindersModule {}
