import { IsString, IsNotEmpty, IsUUID, IsOptional, IsInt, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class PlanTratamientoItemDto {
  @IsString()
  @IsNotEmpty()
  tipo!: string;

  @IsInt()
  @IsOptional()
  piezaPosicion?: number;

  @IsString()
  @IsOptional()
  cara?: string;

  @IsNumber()
  @IsNotEmpty()
  precioRef!: number;
}

export class CreatePlanTratamientoDto {
  @IsUUID()
  @IsNotEmpty()
  pacienteId!: string;

  @IsUUID()
  @IsNotEmpty()
  profesionalId!: string;

  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @IsString()
  @IsOptional()
  notas?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PlanTratamientoItemDto)
  items!: PlanTratamientoItemDto[];
}
