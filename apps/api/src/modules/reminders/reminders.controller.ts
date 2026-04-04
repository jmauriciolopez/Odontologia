import { Controller, Get, Post, Body, Param, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { RemindersService } from './reminders.service';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/constants/roles.constants';

@Controller('reminders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RemindersController {
  constructor(private readonly remindersService: RemindersService) {}

  @Get()
  @Roles(Role.ADMIN, Role.RECEPCIONISTA)
  findAll() {
    return this.remindersService.findAll();
  }

  @Post()
  @Roles(Role.ADMIN, Role.RECEPCIONISTA)
  create(@Body() dto: CreateReminderDto) {
    return this.remindersService.createManual(dto);
  }

  @Post(':id/enviar')
  @Roles(Role.ADMIN, Role.RECEPCIONISTA)
  enviar(@Param('id', ParseUUIDPipe) id: string) {
    return this.remindersService.enviarManual(id);
  }
}
