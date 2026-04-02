import { httpClient } from '../../../lib/Httpclient';
import { Reminder } from '../types';

export const remindersApi = {
  findAll: async (): Promise<Reminder[]> => {
    return httpClient.get('reminders');
  },
};
