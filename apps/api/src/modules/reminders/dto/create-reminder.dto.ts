import { IsUUID, IsNotEmpty, IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateReminderDto {
  @IsUUID()
  @IsNotEmpty()
  pacienteId: string;

  @IsUUID()
  @IsNotEmpty()
  turnoId: string;

  @IsDateString()
  @IsNotEmpty()
  scheduledFor: string;

  @IsString()
  @IsOptional()
  type?: string; // 'whatsapp' | 'email'
}
