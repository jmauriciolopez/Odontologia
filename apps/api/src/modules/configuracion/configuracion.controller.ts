import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ConfiguracionService } from './configuracion.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';

@Controller('configuracion')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ConfiguracionController {
  constructor(private readonly configService: ConfiguracionService) {}

  @Get()
  getConfig() {
    return this.configService.getConfig();
  }

  @Patch()
  updateConfig(@Body() data: any) {
    return this.configService.updateConfig(data);
  }

  @Get('prestaciones')
  getPrestaciones() {
    return this.configService.getPrestaciones();
  }

  @Post('prestaciones')
  createPrestacion(@Body() data: any) {
    return this.configService.createPrestacion(data);
  }

  @Patch('prestaciones/:id')
  updatePrestacion(@Param('id') id: string, @Body() data: any) {
    return this.configService.updatePrestacion(id, data);
  }

  @Delete('prestaciones/:id')
  deletePrestacion(@Param('id') id: string) {
    return this.configService.deletePrestacion(id);
  }
}
