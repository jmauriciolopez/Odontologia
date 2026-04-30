import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsOptional,
  IsDateString,
  IsIn,
  IsInt,
  Min,
  Max,
  ValidateIf,
} from 'class-validator';

export type FrecuenciaRecurrencia = 'diaria' | 'semanal' | 'quincenal' | 'mensual';
export type FinSerieRecurrencia = 'fecha' | 'cantidad';

export class CreateTurnosRecurrentesDto {
  @IsUUID()
  @IsOptional()
  sucursalId?: string;

  @IsUUID()
  @IsNotEmpty()
  pacienteId!: string;

  @IsUUID()
  @IsNotEmpty()
  profesionalId!: string;

  @IsUUID()
  @IsNotEmpty()
  consultorioId!: string;

  @IsDateString()
  @IsNotEmpty()
  fechaInicio!: string;

  @IsDateString()
  @IsNotEmpty()
  fechaFin!: string;

  @IsString()
  @IsOptional()
  estado?: string;

  @IsString()
  @IsOptional()
  motivo?: string;

  @IsIn(['diaria', 'semanal', 'quincenal', 'mensual'])
  frecuencia!: FrecuenciaRecurrencia;

  @IsIn(['fecha', 'cantidad'])
  finSerie!: FinSerieRecurrencia;

  @ValidateIf((o: CreateTurnosRecurrentesDto) => o.finSerie === 'fecha')
  @IsNotEmpty({ message: 'hastaFecha es obligatorio cuando el fin de serie es por fecha' })
  @IsDateString()
  hastaFecha?: string;

  @ValidateIf((o: CreateTurnosRecurrentesDto) => o.finSerie === 'cantidad')
  @IsInt()
  @Min(2)
  @Max(104)
  cantidad?: number;
}
