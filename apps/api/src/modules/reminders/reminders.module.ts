import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { RemindersService } from './reminders.service';
import { RemindersController } from './reminders.controller';
import { Turno } from '../turnos/entities/turno.entity';
import { Reminder } from './entities/reminder.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Turno, Reminder]),
    ScheduleModule.forRoot(),
  ],
  controllers: [RemindersController],
  providers: [RemindersService],
})
export class RemindersModule {}
