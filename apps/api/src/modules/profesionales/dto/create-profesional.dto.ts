import { IsString, IsNotEmpty, IsUUID, IsOptional } from 'class-validator';

export class CreateProfesionalDto {
  @IsUUID()
  @IsNotEmpty()
  usuarioId!: string;

  @IsString()
  @IsOptional()
  especialidad?: string;

  @IsString()
  @IsOptional()
  matricula?: string;
}
