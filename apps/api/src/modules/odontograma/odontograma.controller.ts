import { Controller, Get, Post, Body, Patch, Param, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { OdontogramaService } from './odontograma.service';
import { UpdatePiezaDto, AddProcedimientoDto } from './dto/odontograma.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/constants/roles.constants';

@Controller('odontograma')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OdontogramaController {
  constructor(private readonly odontogramaService: OdontogramaService) {}

  @Get('ficha/:fichaId')
  @Roles(Role.ADMIN, Role.ODONTOLOGO)
  getOdontograma(@Param('fichaId', ParseUUIDPipe) fichaId: string) {
    return this.odontogramaService.getOdontograma(fichaId);
  }

  @Patch('pieza')
  @Roles(Role.ADMIN, Role.ODONTOLOGO)
  updatePieza(@Body() updatePiezaDto: UpdatePiezaDto) {
    return this.odontogramaService.updatePieza(updatePiezaDto);
  }

  @Post('procedimiento')
  @Roles(Role.ADMIN, Role.ODONTOLOGO)
  addProcedimiento(@Body() addProcedimientoDto: AddProcedimientoDto) {
    return this.odontogramaService.addProcedimiento(addProcedimientoDto);
  }
}
