import { IsInt, IsBoolean, IsOptional, Min, Max } from 'class-validator';

export class UpsertMedicionPeriodontalDto {
  @IsInt() @IsOptional() @Min(0) profundidadVestibularDistal?: number;
  @IsInt() @IsOptional() @Min(0) profundidadVestibularMedio?: number;
  @IsInt() @IsOptional() @Min(0) profundidadVestibularMesial?: number;

  @IsInt() @IsOptional() @Min(0) recesionVestibularDistal?: number;
  @IsInt() @IsOptional() @Min(0) recesionVestibularMedio?: number;
  @IsInt() @IsOptional() @Min(0) recesionVestibularMesial?: number;

  @IsInt() @IsOptional() @Min(0) profundidadLingualDistal?: number;
  @IsInt() @IsOptional() @Min(0) profundidadLingualMedio?: number;
  @IsInt() @IsOptional() @Min(0) profundidadLingualMesial?: number;

  @IsInt() @IsOptional() @Min(0) recesionLingualDistal?: number;
  @IsInt() @IsOptional() @Min(0) recesionLingualMedio?: number;
  @IsInt() @IsOptional() @Min(0) recesionLingualMesial?: number;

  @IsBoolean() @IsOptional() sangrado?: boolean;
  @IsBoolean() @IsOptional() placa?: boolean;

  @IsInt() @IsOptional() @Min(0) @Max(3) movilidad?: number;
}
