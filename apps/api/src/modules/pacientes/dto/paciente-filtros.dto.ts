import { IsString, IsOptional } from 'class-validator';

export class PacienteFiltrosDto {
  @IsString()
  @IsOptional()
  query?: string;
}
