import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config.ts';
import { AuthModule } from './modules/auth/auth.module.ts';
import { UsuariosModule } from './modules/usuarios/usuarios.module.ts';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthModule,
    UsuariosModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
