import { useQuery } from '@tanstack/react-query';
import { remindersApi } from '../api/reminders-api';

export const useReminders = () => {
  return useQuery({
    queryKey: ['reminders'],
    queryFn: () => remindersApi.findAll(),
    refetchInterval: 30000,
  });
};
