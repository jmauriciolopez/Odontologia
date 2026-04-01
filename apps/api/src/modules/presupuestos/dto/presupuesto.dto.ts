import { IsString, IsNotEmpty, IsUUID, IsOptional, IsDecimal, IsArray, ValidateNested, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class PresupuestoItemDto {
  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsInt()
  @IsNotEmpty()
  cantidad: number;

  @IsDecimal()
  @IsNotEmpty()
  precioUnitario: number;

  @IsDecimal()
  @IsOptional()
  descuento?: number;
}

export class CreatePresupuestoDto {
  @IsUUID()
  @IsNotEmpty()
  pacienteId: string;

  @IsUUID()
  @IsOptional()
  planId?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PresupuestoItemDto)
  items: PresupuestoItemDto[];
}

export class RegisterPagoDto {
  @IsUUID()
  @IsNotEmpty()
  presupuestoId: string;

  @IsDecimal()
  @IsNotEmpty()
  monto: number;

  @IsString()
  @IsNotEmpty()
  metodoPago: string;

  @IsString()
  @IsOptional()
  notas?: string;
}
