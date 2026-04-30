import { IsDateString, IsNotEmpty, IsUUID, IsOptional } from 'class-validator';

export class DisponibilidadQueryDto {
  @IsDateString()
  @IsNotEmpty()
  fechaInicio!: string;

  @IsDateString()
  @IsNotEmpty()
  fechaFin!: string;

  @IsUUID()
  @IsNotEmpty()
  profesionalId!: string;

  @IsUUID()
  @IsNotEmpty()
  consultorioId!: string;

  @IsUUID()
  @IsOptional()
  excludeTurnoId?: string;
}
