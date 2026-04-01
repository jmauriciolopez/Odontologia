import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

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
}
