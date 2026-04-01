import { IsNotEmpty, IsInt, IsUUID, IsObject, IsOptional, IsString } from 'class-validator';

export class UpdatePiezaDto {
  @IsUUID()
  @IsNotEmpty()
  piezaId: string;

  @IsObject()
  @IsOptional()
  caras?: {
    vestibular?: string;
    lingual?: string;
    oclusal?: string;
    distal?: string;
    mesial?: string;
  };
}

export class AddProcedimientoDto {
  @IsUUID()
  @IsNotEmpty()
  piezaId: string;

  @IsString()
  @IsNotEmpty()
  tipo: string;

  @IsString()
  @IsOptional()
  cara?: string;

  @IsString()
  @IsOptional()
  observaciones?: string;
}
