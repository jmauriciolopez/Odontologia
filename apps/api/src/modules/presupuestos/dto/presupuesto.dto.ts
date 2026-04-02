import { IsString, IsNotEmpty, IsUUID, IsOptional, IsNumber, IsArray, ValidateNested, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class PresupuestoItemDto {
  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsInt()
  @IsNotEmpty()
  cantidad: number;

  @IsNumber()
  @IsNotEmpty()
  precioUnitario: number;

  @IsNumber()
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

  @IsNumber()
  @IsNotEmpty()
  monto: number;

  @IsString()
  @IsNotEmpty()
  metodoPago: string;

  @IsString()
  @IsOptional()
  notas?: string;
}
