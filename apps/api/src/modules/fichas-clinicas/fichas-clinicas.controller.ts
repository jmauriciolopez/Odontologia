import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { FichasClinicasService } from './fichas-clinicas.service.ts';
import { CreateFichaClinicaDto } from './dto/create-ficha-clinica.dto.ts';
import { CreateAntecedenteDto } from './dto/create-antecedente.dto.ts';
import { CreateEvolucionClinicaDto } from './dto/create-evolucion-clinica.dto.ts';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.ts';
import { RolesGuard } from '../../common/guards/roles.guard.ts';
import { Roles } from '../../common/decorators/roles.decorator.ts';
import { Role } from '../../common/constants/roles.constants.ts';

@Controller('fichas-clinicas')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FichasClinicasController {
  constructor(private readonly fichasService: FichasClinicasService) {}

  @Post()
  @Roles(Role.ADMIN, Role.ODONTOLOGO)
  createFicha(@Body() dto: CreateFichaClinicaDto) {
    return this.fichasService.createFicha(dto);
  }

  @Get('paciente/:id')
  findByPaciente(@Param('id') id: string) {
    return this.fichasService.findByPaciente(id);
  }

  @Post('antecedentes')
  @Roles(Role.ODONTOLOGO)
  addAntecedente(@Body() dto: CreateAntecedenteDto) {
    return this.fichasService.addAntecedente(dto);
  }

  @Post('evoluciones')
  @Roles(Role.ODONTOLOGO)
  addEvolucion(@Body() dto: CreateEvolucionClinicaDto) {
    return this.fichasService.addEvolucion(dto);
  }
}
