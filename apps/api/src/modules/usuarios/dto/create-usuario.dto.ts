import { IsEmail, IsString, MinLength, IsOptional, IsArray } from 'class-validator';

export class CreateUsuarioDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsOptional()
  nombre?: string;

  @IsString()
  @IsOptional()
  apellido?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  rolIds?: string[];
}
