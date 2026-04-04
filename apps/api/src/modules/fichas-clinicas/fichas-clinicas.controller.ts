import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { FichasClinicasService } from './fichas-clinicas.service';
import { CreateFichaClinicaDto } from './dto/create-ficha-clinica.dto';
import { CreateAntecedenteDto } from './dto/create-antecedente.dto';
import { CreateEvolucionClinicaDto } from './dto/create-evolucion-clinica.dto';
import { UpsertMedicionPeriodontalDto } from './dto/upsert-medicion-periodontal.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/constants/roles.constants';

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

  @Post(':fichaId/mediciones-periodontales/:diente')
  @Roles(Role.ADMIN, Role.ODONTOLOGO)
  upsertMedicion(
    @Param('fichaId') fichaId: string,
    @Param('diente') diente: string,
    @Body() data: UpsertMedicionPeriodontalDto
  ) {
    return this.fichasService.upsertMedicion(fichaId, parseInt(diente), data);
  }
}
