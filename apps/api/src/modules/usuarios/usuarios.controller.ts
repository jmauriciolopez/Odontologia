import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/constants/roles.constants';

@Controller('usuarios')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  @Roles(Role.ADMIN)
  async create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return await this.usuariosService.create(createUsuarioDto);
  }

  @Get('roles')
  @Roles(Role.ADMIN)
  async findAllRoles() {
    return await this.usuariosService.findAllRoles();
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

  @Patch(':id')
  @Roles(Role.ADMIN)
  async update(@Param('id') id: string, @Body() dto: UpdateUsuarioDto) {
    return await this.usuariosService.update(id, dto);
  }

  @Patch(':id/password')
  @Roles(Role.ADMIN)
  async changePassword(@Param('id') id: string, @Body('password') password: string) {
    if (!password || password.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    }
    await this.usuariosService.changePassword(id, password);
    return { message: 'Contraseña actualizada correctamente' };
  }
}
