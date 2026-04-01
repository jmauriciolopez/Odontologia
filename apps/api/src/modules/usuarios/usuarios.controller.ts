import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { UsuariosService } from './usuarios.service.ts';
import { CreateUsuarioDto } from './dto/create-usuario.dto.ts';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.ts';
import { RolesGuard } from '../../common/guards/roles.guard.ts';
import { Roles } from '../../common/decorators/roles.decorator.ts';
import { Role } from '../../common/constants/roles.constants.ts';

@Controller('usuarios')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  @Roles(Role.ADMIN)
  async create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return await this.usuariosService.create(createUsuarioDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  async findAll() {
    return await this.usuariosService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.usuariosService.findOne(id);
  }
}
