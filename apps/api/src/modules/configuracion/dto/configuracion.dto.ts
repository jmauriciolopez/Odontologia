import { IsString, IsOptional, IsBoolean, IsNumber, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ColoresEstadosDto {
  @IsString() @IsOptional() sano?: string;
  @IsString() @IsOptional() caries?: string;
  @IsString() @IsOptional() restauracion?: string;
  @IsString() @IsOptional() perdida?: string;
  @IsString() @IsOptional() ausente?: string;
  @IsString() @IsOptional() protesis?: string;
}

export class UpdateConfiguracionDto {
  @IsString()
  @IsOptional()
  sistemaDental?: string;

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => ColoresEstadosDto)
  coloresEstados?: ColoresEstadosDto;
}

export class CreatePrestacionDto {
  @IsString()
  codigo: string;

  @IsString()
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsNumber()
  @IsOptional()
  honorarios?: number;
}

export class UpdatePrestacionDto {
  @IsString()
  @IsOptional()
  nombre?: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsNumber()
  @IsOptional()
  honorarios?: number;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}
