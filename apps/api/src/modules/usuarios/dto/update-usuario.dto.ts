import { IsString, IsOptional, IsBoolean, IsArray, IsUUID } from 'class-validator';

export class UpdateUsuarioDto {
  @IsString()
  @IsOptional()
  nombre?: string;

  @IsString()
  @IsOptional()
  apellido?: string;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;

  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  rolIds?: string[];
}
