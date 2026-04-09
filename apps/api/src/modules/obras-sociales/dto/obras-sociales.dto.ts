import { IsString, IsOptional, IsBoolean, IsNumber, IsUUID, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateObraSocialDto {
  @IsString()
  nombre: string;

  @IsString()
  @IsOptional()
  codigo?: string;

  @IsString()
  @IsOptional()
  descripcion?: string;
}

export class UpdateObraSocialDto {
  @IsString()
  @IsOptional()
  nombre?: string;

  @IsString()
  @IsOptional()
  codigo?: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}

export class UpsertPrestacionPrecioDto {
  @IsUUID()
  prestacionId: string;

  @IsNumber()
  precio: number;
}

export class BulkUpsertPreciosDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpsertPrestacionPrecioDto)
  precios: UpsertPrestacionPrecioDto[];
}
