import { IsDateString, IsOptional, IsUUID, IsString } from 'class-validator';

export class TurnoFiltrosDto {
  @IsDateString()
  @IsOptional()
  fecha?: string;

  @IsUUID()
  @IsOptional()
  profesionalId?: string;

  @IsUUID()
  @IsOptional()
  pacienteId?: string;

  @IsString()
  @IsOptional()
  estado?: string;
}
