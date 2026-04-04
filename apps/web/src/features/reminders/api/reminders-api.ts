import { httpClient } from '../../../lib/Httpclient';
import { Reminder } from '../types';

export interface CreateReminderDto {
  pacienteId: string;
  turnoId: string;
  scheduledFor: string;
  type?: string;
}

export const remindersApi = {
  findAll: async (): Promise<Reminder[]> => {
    return httpClient.get('reminders');
  },

  create: async (data: CreateReminderDto): Promise<Reminder> => {
    return httpClient.post('reminders', data);
  },

  enviar: async (id: string): Promise<Reminder> => {
    return httpClient.post(`reminders/${id}/enviar`);
  },
};
