import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ArchivosService } from './archivos.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/constants/roles.constants';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('archivos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ArchivosController {
  constructor(private readonly archivosService: ArchivosService) {}

  @Post('paciente/:pacienteId/documento')
  @Roles(Role.ADMIN, Role.RECEPCIONISTA, Role.ODONTOLOGO)
  @UseInterceptors(FileInterceptor('file'))
  async uploadDocumento(
    @Param('pacienteId', ParseUUIDPipe) pacienteId: string,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser('id') userId: string,
  ) {
    return await this.archivosService.saveDocumento(file, pacienteId, userId);
  }

  @Post('paciente/:pacienteId/radiografia')
  @Roles(Role.ADMIN, Role.ODONTOLOGO)
  @UseInterceptors(FileInterceptor('file'))
  async uploadRadiografia(
    @Param('pacienteId', ParseUUIDPipe) pacienteId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('tipo') tipo: string,
    @Body('fechaToma') fechaToma?: string,
    @CurrentUser('id') userId: string,
  ) {
    return await this.archivosService.saveRadiografia(file, pacienteId, tipo, fechaToma, userId);
  }

  @Get('paciente/:pacienteId')
  async listByPaciente(@Param('pacienteId', ParseUUIDPipe) pacienteId: string) {
    return await this.archivosService.findByPaciente(pacienteId);
  }

  @Delete('documento/:id')
  @Roles(Role.ADMIN)
  async deleteDocumento(@Param('id', ParseUUIDPipe) id: string) {
    await this.archivosService.deleteDocumento(id);
    return { message: 'Documento eliminado correctamente' };
  }
}
