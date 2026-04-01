import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { PacientesService } from './pacientes.service.ts';
import { CreatePacienteDto } from './dto/create-paciente.dto.ts';
import { UpdatePacienteDto } from './dto/update-paciente.dto.ts';
import { PacienteFiltrosDto } from './dto/paciente-filtros.dto.ts';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.ts';
import { RolesGuard } from '../../common/guards/roles.guard.ts';
import { Roles } from '../../common/decorators/roles.decorator.ts';
import { Role } from '../../common/constants/roles.constants.ts';

@Controller('pacientes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PacientesController {
  constructor(private readonly pacientesService: PacientesService) {}

  @Post()
  @Roles(Role.ADMIN, Role.RECEPCIONISTA, Role.ODONTOLOGO)
  create(@Body() createPacienteDto: CreatePacienteDto) {
    return this.pacientesService.create(createPacienteDto);
  }

  @Get()
  findAll(@Query() filtros: PacienteFiltrosDto) {
    return this.pacientesService.findAll(filtros);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pacientesService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.RECEPCIONISTA, Role.ODONTOLOGO)
  update(@Param('id') id: string, @Body() updatePacienteDto: UpdatePacienteDto) {
    return this.pacientesService.update(id, updatePacienteDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.pacientesService.remove(id);
  }
}
