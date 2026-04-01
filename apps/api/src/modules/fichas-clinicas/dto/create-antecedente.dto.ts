import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateAntecedenteDto {
  @IsUUID()
  @IsNotEmpty()
  fichaId: string;

  @IsString()
  @IsNotEmpty()
  tipo: string;

  @IsString()
  @IsNotEmpty()
  descripcion: string;
}
