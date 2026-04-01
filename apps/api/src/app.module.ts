import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config.ts';
import { AuthModule } from './modules/auth/auth.module.ts';
import { UsuariosModule } from './modules/usuarios/usuarios.module.ts';
import { PacientesModule } from './modules/pacientes/pacientes.module.ts';
import { FichasClinicasModule } from './modules/fichas-clinicas/fichas-clinicas.module.ts';
import { ArchivosModule } from './modules/archivos/archivos.module.ts';
import { ProfesionalesModule } from './modules/profesionales/profesionales.module.ts';
import { ConsultoriosModule } from './modules/consultorios/consultorios.module.ts';
import { TurnosModule } from './modules/turnos/turnos.module.ts';

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
