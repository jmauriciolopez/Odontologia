import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './modules/auth/auth.module';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { PacientesModule } from './modules/pacientes/pacientes.module';
import { FichasClinicasModule } from './modules/fichas-clinicas/fichas-clinicas.module';
import { ArchivosModule } from './modules/archivos/archivos.module';
import { ProfesionalesModule } from './modules/profesionales/profesionales.module';
import { ConsultoriosModule } from './modules/consultorios/consultorios.module';
import { TurnosModule } from './modules/turnos/turnos.module';
import { OdontogramaModule } from './modules/odontograma/odontograma.module';
import { PlanesTratamientoModule } from './modules/planes-tratamiento/planes-tratamiento.module';
import { PresupuestosModule } from './modules/presupuestos/presupuestos.module';
import { RemindersModule } from './modules/reminders/reminders.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { ConfiguracionModule } from './modules/configuracion/configuracion.module';
import { ObrasSocialesModule } from './modules/obras-sociales/obras-sociales.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100, // Máximo 100 requests por minuto por IP
    }]),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
      serveStaticOptions: { index: false },
    }),
    AuthModule,
    UsuariosModule,
    PacientesModule,
    FichasClinicasModule,
    ArchivosModule,
    ProfesionalesModule,
    ConsultoriosModule,
    TurnosModule,
    OdontogramaModule,
    PlanesTratamientoModule,
    PresupuestosModule,
    RemindersModule,
    DashboardModule,
    ConfiguracionModule,
    ObrasSocialesModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
