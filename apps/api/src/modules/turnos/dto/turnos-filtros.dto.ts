import { IsDateString, IsOptional, IsUUID, IsString } from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class TurnoFiltrosDto extends PaginationDto {
  @IsDateString()
  @IsOptional()
  fecha?: string;

  @IsDateString()
  @IsOptional()
  desde?: string;

  @IsDateString()
  @IsOptional()
  hasta?: string;

  @IsUUID()
  @IsOptional()
  profesionalId?: string;

  @IsUUID()
  @IsOptional()
  consultorioId?: string;

  @IsUUID()
  @IsOptional()
  pacienteId?: string;

  @IsString()
  @IsOptional()
  estado?: string;
}
