import { Controller, Get, Post, Patch, Body, Param, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { PlanesTratamientoService } from './planes-tratamiento.service';
import { CreatePlanTratamientoDto } from './dto/plan-tratamiento.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/constants/roles.constants';

@Controller('planes-tratamiento')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PlanesTratamientoController {
  constructor(private readonly planesService: PlanesTratamientoService) {}

  @Get()
  @Roles(Role.ADMIN, Role.ODONTOLOGO)
  findAll() {
    return this.planesService.findAll();
  }

  @Post()
  @Roles(Role.ADMIN, Role.ODONTOLOGO)
  create(@Body() dto: CreatePlanTratamientoDto) {
    return this.planesService.create(dto);
  }

  @Get('paciente/:id')
  findByPaciente(@Param('id', ParseUUIDPipe) id: string) {
    return this.planesService.findByPaciente(id);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.planesService.findOne(id);
  }

  @Patch(':id/estado')
  @Roles(Role.ADMIN, Role.ODONTOLOGO)
  updateEstado(@Param('id', ParseUUIDPipe) id: string, @Body('estado') estado: string) {
    return this.planesService.updateEstado(id, estado);
  }

  @Patch('items/:id/estado')
  @Roles(Role.ADMIN, Role.ODONTOLOGO)
  updateItemEstado(@Param('id', ParseUUIDPipe) id: string, @Body('estado') estado: string) {
    return this.planesService.updateItemEstado(id, estado);
  }
}
