import { Controller, Get, Post, Patch, Delete, Body, Param, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ObrasSocialesService } from './obras-sociales.service';
import { CreateObraSocialDto, UpdateObraSocialDto, BulkUpsertPreciosDto } from './dto/obras-sociales.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/constants/roles.constants';

@Controller('obras-sociales')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ObrasSocialesController {
  constructor(private readonly service: ObrasSocialesService) {}

  @Get()
  findAll() { return this.service.findAll(); }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) { return this.service.findOne(id); }

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() dto: CreateObraSocialDto) { return this.service.create(dto); }

  @Patch(':id')
  @Roles(Role.ADMIN)
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateObraSocialDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id', ParseUUIDPipe) id: string) { return this.service.remove(id); }

  // Precios por obra social
  @Get(':id/prestaciones')
  getPrestaciones(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.getPrestaciones(id);
  }

  @Post(':id/prestaciones')
  @Roles(Role.ADMIN)
  upsertPrecios(@Param('id', ParseUUIDPipe) id: string, @Body() dto: BulkUpsertPreciosDto) {
    return this.service.upsertPrecios(id, dto);
  }

  @Delete(':id/prestaciones/:prestacionId')
  @Roles(Role.ADMIN)
  deletePrecio(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('prestacionId', ParseUUIDPipe) prestacionId: string,
  ) {
    return this.service.deletePrecio(id, prestacionId);
  }
}
