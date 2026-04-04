import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';

export class UploadDocumentoDto {
  @IsString()
  @IsOptional()
  descripcion?: string;
}

export class UploadRadiografiaDto {
  @IsString()
  @IsNotEmpty()
  tipo: string; // panoramica, periapical, bitewing, cefalometrica

  @IsDateString()
  @IsOptional()
  fechaToma?: string;

  @IsString()
  @IsOptional()
  descripcion?: string;
}
