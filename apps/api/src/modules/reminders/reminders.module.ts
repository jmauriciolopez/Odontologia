import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import { RemindersService } from './reminders.service';
import { RemindersController } from './reminders.controller';
import { Turno } from '../turnos/entities/turno.entity';
import { Reminder } from './entities/reminder.entity';
import { WhatsAppService } from './whatsapp.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Turno, Reminder]),
    ScheduleModule.forRoot(),
    HttpModule,
  ],
  controllers: [RemindersController],
  providers: [RemindersService, WhatsAppService],
  exports: [RemindersService, WhatsAppService],
})
export class RemindersModule {}
