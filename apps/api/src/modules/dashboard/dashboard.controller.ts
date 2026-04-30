import { Controller, Get, UseGuards, Query, Res, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { Response } from 'express';
import { DashboardService } from './dashboard.service';
import { PdfService } from '../reports/pdf.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/constants/roles.constants';

@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
  constructor(
    private readonly dashboardService: DashboardService,
    private readonly pdfService: PdfService,
  ) {}

  @Get('stats')
  @Roles(Role.ADMIN, Role.ODONTOLOGO, Role.RECEPCIONISTA)
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(300) // 5 minutes
  async getStats() {
    return this.dashboardService.getStats();
  }

  @Get('historical')
  @Roles(Role.ADMIN, Role.ODONTOLOGO, Role.RECEPCIONISTA)
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(600) // 10 minutes
  async getHistoricalStats(
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    return this.dashboardService.getHistoricalStats(from, to);
  }

  @Get('historical/export-pdf')
  @Roles(Role.ADMIN, Role.ODONTOLOGO, Role.RECEPCIONISTA)
  async exportHistoricalPdf(
    @Query('from') from: string,
    @Query('to') to: string,
    @Res() res: Response,
  ) {
    const data = await this.dashboardService.getHistoricalStats(from, to);
    const buffer = await this.pdfService.generateDashboardReport(data);
    
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=dashboard-historico-${from}-${to}.pdf`,
      'Content-Length': buffer.length,
    });
    
    res.end(buffer);
  }

  @Get('reports/cobranza/export-pdf')
  @Roles(Role.ADMIN)
  async exportCobranzaPdf(
    @Query('from') from: string,
    @Query('to') to: string,
    @Res() res: Response,
  ) {
    const data = await this.dashboardService.getCobranzaReport(from, to);
    const buffer = await this.pdfService.generateCobranzaReport(data);
    
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=reporte-cobranza-${from}-${to}.pdf`,
      'Content-Length': buffer.length,
    });
    
    res.end(buffer);
  }

  @Get('reports/pacientes-nuevos/export-pdf')
  @Roles(Role.ADMIN, Role.RECEPCIONISTA)
  async exportPacientesNuevosPdf(
    @Query('from') from: string,
    @Query('to') to: string,
    @Res() res: Response,
  ) {
    const data = await this.dashboardService.getNuevosPacientesReport(from, to);
    const buffer = await this.pdfService.generateNuevosPacientesReport(data);
    
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=reporte-pacientes-nuevos-${from}-${to}.pdf`,
      'Content-Length': buffer.length,
    });
    
    res.end(buffer);
  }
}
