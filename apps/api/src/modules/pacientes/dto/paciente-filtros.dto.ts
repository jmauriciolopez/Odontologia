import { IsString, IsOptional } from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class PacienteFiltrosDto extends PaginationDto {
  @IsString()
  @IsOptional()
  query?: string;
}
