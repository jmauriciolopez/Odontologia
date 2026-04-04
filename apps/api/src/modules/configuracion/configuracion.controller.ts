import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ConfiguracionService } from './configuracion.service';
import { UpdateConfiguracionDto, CreatePrestacionDto, UpdatePrestacionDto } from './dto/configuracion.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/constants/roles.constants';

@Controller('configuracion')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ConfiguracionController {
  constructor(private readonly configService: ConfiguracionService) {}

  @Get()
  getConfig() {
    return this.configService.getConfig();
  }

  @Patch()
  @Roles(Role.ADMIN)
  updateConfig(@Body() dto: UpdateConfiguracionDto) {
    return this.configService.updateConfig(dto);
  }

  @Get('prestaciones')
  getPrestaciones() {
    return this.configService.getPrestaciones();
  }

  @Post('prestaciones')
  @Roles(Role.ADMIN)
  createPrestacion(@Body() dto: CreatePrestacionDto) {
    return this.configService.createPrestacion(dto);
  }

  @Patch('prestaciones/:id')
  @Roles(Role.ADMIN)
  updatePrestacion(@Param('id') id: string, @Body() dto: UpdatePrestacionDto) {
    return this.configService.updatePrestacion(id, dto);
  }

  @Delete('prestaciones/:id')
  @Roles(Role.ADMIN)
  deletePrestacion(@Param('id') id: string) {
    return this.configService.deletePrestacion(id);
  }
}
