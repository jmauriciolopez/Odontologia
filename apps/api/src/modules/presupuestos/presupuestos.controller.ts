import { Controller, Get, Post, Body, Param, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { PresupuestosService } from './presupuestos.service';
import { CreatePresupuestoDto, RegisterPagoDto } from './dto/presupuesto.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/constants/roles.constants';

@Controller('presupuestos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PresupuestosController {
  constructor(private readonly presupuestosService: PresupuestosService) {}

  @Post()
  @Roles(Role.ADMIN, Role.RECEPCIONISTA)
  create(@Body() dto: CreatePresupuestoDto) {
    return this.presupuestosService.create(dto);
  }

  @Get('paciente/:id')
  findByPaciente(@Param('id', ParseUUIDPipe) id: string) {
    return this.presupuestosService.findByPaciente(id);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.presupuestosService.findOne(id);
  }

  @Post('pagos')
  @Roles(Role.ADMIN, Role.RECEPCIONISTA)
  registerPago(@Body() dto: RegisterPagoDto) {
    return this.presupuestosService.registerPago(dto);
  }
}
