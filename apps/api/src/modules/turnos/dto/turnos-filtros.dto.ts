import { IsDateString, IsOptional, IsUUID, IsString } from 'class-validator';

export class TurnoFiltrosDto {
  @IsDateString()
  @IsOptional()
  fecha?: string;

  @IsDateString()
  @IsOptional()
  desde?: string;

  @IsDateString()
  @IsOptional()
  hasta?: string;

  @IsUUID()
  @IsOptional()
  profesionalId?: string;

  @IsUUID()
  @IsOptional()
  consultorioId?: string;

  @IsUUID()
  @IsOptional()
  pacienteId?: string;

  @IsString()
  @IsOptional()
  estado?: string;
}
