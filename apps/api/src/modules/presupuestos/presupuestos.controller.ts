import { Controller, Get, Post, Body, Param, UseGuards, ParseUUIDPipe, Patch, Res, Query } from '@nestjs/common';
import { Response } from 'express';
import { PresupuestosService } from './presupuestos.service';
import { PdfService } from '../reports/pdf.service';
import { CreatePresupuestoDto, RegisterPagoDto } from './dto/presupuesto.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/constants/roles.constants';

@Controller('presupuestos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PresupuestosController {
  constructor(
    private readonly presupuestosService: PresupuestosService,
    private readonly pdfService: PdfService,
  ) {}

  @Post()
  @Roles(Role.ADMIN, Role.RECEPCIONISTA)
  create(@Body() dto: CreatePresupuestoDto) {
    return this.presupuestosService.create(dto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.RECEPCIONISTA)
  findAll(@Query() pagination: PaginationDto) {
    return this.presupuestosService.findAll(pagination);
  }

  @Get('paciente/:id')
  @Roles(Role.ADMIN, Role.RECEPCIONISTA)
  findByPaciente(@Param('id', ParseUUIDPipe) id: string) {
    return this.presupuestosService.findByPaciente(id);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.RECEPCIONISTA)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.presupuestosService.findOne(id);
  }

  @Post('pago')
  @Roles(Role.ADMIN, Role.RECEPCIONISTA)
  registerPago(@Body() dto: RegisterPagoDto) {
    return this.presupuestosService.registerPago(dto);
  }

  @Get(':id/pagos')
  @Roles(Role.ADMIN, Role.RECEPCIONISTA)
  getPagos(@Param('id', ParseUUIDPipe) id: string) {
    return this.presupuestosService.findPagosByPresupuesto(id);
  }

  @Patch(':id/iniciar')
  @Roles(Role.ADMIN, Role.RECEPCIONISTA)
  iniciar(@Param('id', ParseUUIDPipe) id: string) {
    return this.presupuestosService.iniciarTratamiento(id);
  }

  @Get(':id/export-pdf')
  @Roles(Role.ADMIN, Role.RECEPCIONISTA)
  async exportPdf(@Param('id', ParseUUIDPipe) id: string, @Res() res: Response) {
    const presupuesto = await this.presupuestosService.findOne(id);
    const buffer = await this.pdfService.generatePresupuestoPdf(presupuesto);
    
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=presupuesto-${id}.pdf`,
      'Content-Length': buffer.length,
    });
    
    res.end(buffer);
  }
}
