import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ConsultoriosService } from './consultorios.service.ts';
import { CreateConsultorioDto } from './dto/create-consultorio.dto.ts';
import { UpdateConsultorioDto } from './dto/update-consultorio.dto.ts';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.ts';
import { RolesGuard } from '../../common/guards/roles.guard.ts';
import { Roles } from '../../common/decorators/roles.decorator.ts';
import { Role } from '../../common/constants/roles.constants.ts';

@Controller('consultorios')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ConsultoriosController {
  constructor(private readonly consultoriosService: ConsultoriosService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createConsultorioDto: CreateConsultorioDto) {
    return this.consultoriosService.create(createConsultorioDto);
  }

  @Get()
  findAll() {
    return this.consultoriosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.consultoriosService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() updateConsultorioDto: UpdateConsultorioDto) {
    return this.consultoriosService.update(id, updateConsultorioDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.consultoriosService.remove(id);
  }
}
