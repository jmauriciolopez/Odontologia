import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { TurnosService } from './turnos.service';
import { CreateTurnoDto } from './dto/create-turnos.dto';
import { UpdateTurnoDto } from './dto/update-turnos.dto';
import { TurnoFiltrosDto } from './dto/turnos-filtros.dto';
import { DisponibilidadQueryDto } from './dto/disponibilidad-query.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/constants/roles.constants';

@Controller('turnos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TurnosController {
  constructor(private readonly turnosService: TurnosService) {}

  @Post()
  @Roles(Role.ADMIN, Role.RECEPCIONISTA, Role.ODONTOLOGO)
  create(@Body() createTurnoDto: CreateTurnoDto) {
    return this.turnosService.create(createTurnoDto);
  }

  @Get()
  findAll(@Query() filtros: TurnoFiltrosDto) {
    return this.turnosService.findAll(filtros);
  }

  @Get('disponibilidad')
  checkDisponibilidad(@Query() query: DisponibilidadQueryDto) {
    return this.turnosService.checkDisponibilidad(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.turnosService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.RECEPCIONISTA, Role.ODONTOLOGO)
  update(@Param('id') id: string, @Body() updateTurnoDto: UpdateTurnoDto) {
    return this.turnosService.update(id, updateTurnoDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.RECEPCIONISTA)
  remove(@Param('id') id: string) {
    return this.turnosService.remove(id);
  }
}
