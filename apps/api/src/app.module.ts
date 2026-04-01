import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config.ts';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    // Los módulos de dominio se agregarán aquí en fases posteriores
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
