import { PartialType } from '@nestjs/mapped-types';
import { CreatePacienteDto } from './create-paciente.dto.ts';

export class UpdatePacienteDto extends PartialType(CreatePacienteDto) {}
