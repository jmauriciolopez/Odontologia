import { IsString, IsNotEmpty, IsUUID, IsOptional } from 'class-validator';

export class CreateEvolucionClinicaDto {
  @IsUUID()
  @IsNotEmpty()
  fichaId: string;

  @IsUUID()
  @IsOptional()
  profesionalId?: string;

  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsString()
  @IsOptional()
  categoria?: string;
}
