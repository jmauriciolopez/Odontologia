import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config.ts';
import { AuthModule } from './modules/auth/auth.module.ts';
import { UsuariosModule } from './modules/usuarios/usuarios.module.ts';
import { PacientesModule } from './modules/pacientes/pacientes.module.ts';
import { FichasClinicasModule } from './modules/fichas-clinicas/fichas-clinicas.module.ts';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthModule,
    UsuariosModule,
    PacientesModule,
    FichasClinicasModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
