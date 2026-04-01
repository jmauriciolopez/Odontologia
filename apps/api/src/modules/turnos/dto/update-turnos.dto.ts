import { PartialType } from '@nestjs/mapped-types';
import { CreateTurnoDto } from './create-turnos.dto';

export class UpdateTurnoDto extends PartialType(CreateTurnoDto) {}
