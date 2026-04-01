import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ProfesionalesService } from './profesionales.service.ts';
import { CreateProfesionalDto } from './dto/create-profesional.dto.ts';
import { UpdateProfesionalDto } from './dto/update-profesional.dto.ts';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.ts';
import { RolesGuard } from '../../common/guards/roles.guard.ts';
import { Roles } from '../../common/decorators/roles.decorator.ts';
import { Role } from '../../common/constants/roles.constants.ts';

@Controller('profesionales')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProfesionalesController {
  constructor(private readonly profesionalesService: ProfesionalesService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createProfesionalDto: CreateProfesionalDto) {
    return this.profesionalesService.create(createProfesionalDto);
  }

  @Get()
  findAll() {
    return this.profesionalesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.profesionalesService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() updateProfesionalDto: UpdateProfesionalDto) {
    return this.profesionalesService.update(id, updateProfesionalDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.profesionalesService.remove(id);
  }
}
