import { IsString, IsNotEmpty, IsUUID, IsOptional, IsBoolean, IsNumber, IsArray } from 'class-validator';

export class CreateConsultorioDto {
  @IsUUID()
  @IsOptional()
  sucursalId?: string;

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsOptional()
  direccion?: string;

  @IsNumber()
  @IsOptional()
  numeroSillones?: number;

  @IsString()
  @IsOptional()
  piso?: string;

  @IsString()
  @IsOptional()
  telefono?: string;

  @IsString()
  @IsOptional()
  whatsapp?: string;

  @IsString()
  @IsOptional()
  horario?: string;

  @IsArray()
  @IsOptional()
  diasAtencion?: string[];

  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}
