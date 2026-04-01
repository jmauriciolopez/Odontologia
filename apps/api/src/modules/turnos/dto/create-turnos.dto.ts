import { IsString, IsNotEmpty, IsUUID, IsOptional, IsDateString } from 'class-validator';

export class CreateTurnoDto {
  @IsUUID()
  @IsOptional()
  sucursalId?: string;

  @IsUUID()
  @IsNotEmpty()
  pacienteId: string;

  @IsUUID()
  @IsNotEmpty()
  profesionalId: string;

  @IsUUID()
  @IsNotEmpty()
  consultorioId: string;

  @IsDateString()
  @IsNotEmpty()
  fechaInicio: string;

  @IsDateString()
  @IsNotEmpty()
  fechaFin: string;

  @IsString()
  @IsOptional()
  estado?: string;

  @IsString()
  @IsOptional()
  motivo?: string;
}
