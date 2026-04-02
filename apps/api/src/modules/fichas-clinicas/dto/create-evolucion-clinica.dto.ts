import { IsString, IsNotEmpty, IsUUID, IsOptional } from 'class-validator';

export class CreateEvolucionClinicaDto {
  @IsUUID()
  @IsNotEmpty()
  fichaId: string;

  @IsUUID()
  @IsNotEmpty()
  profesionalId: string;

  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsString()
  @IsOptional()
  categoria?: string;
}
