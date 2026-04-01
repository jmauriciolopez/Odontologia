import { PartialType } from '@nestjs/mapped-types';
import { CreateTurnoDto } from './create-turnos.dto.ts';

export class UpdateTurnoDto extends PartialType(CreateTurnoDto) {}
