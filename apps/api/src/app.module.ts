import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
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

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
