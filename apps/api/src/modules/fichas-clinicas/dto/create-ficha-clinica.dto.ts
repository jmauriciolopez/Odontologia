import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateFichaClinicaDto {
  @IsUUID()
  @IsNotEmpty()
  pacienteId: string;

  @IsString()
  @IsOptional()
  observacionesGenerales?: string;
}
