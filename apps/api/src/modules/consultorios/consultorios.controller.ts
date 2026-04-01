import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ConsultoriosService } from './consultorios.service';
import { CreateConsultorioDto } from './dto/create-consultorio.dto';
import { UpdateConsultorioDto } from './dto/update-consultorio.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/constants/roles.constants';

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
