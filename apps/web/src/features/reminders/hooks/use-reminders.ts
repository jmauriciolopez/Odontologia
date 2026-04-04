import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { remindersApi, CreateReminderDto } from '../api/reminders-api';

export const useReminders = () => {
  return useQuery({
    queryKey: ['reminders'],
    queryFn: () => remindersApi.findAll(),
    refetchInterval: 30000,
  });
};

export const useReminderMutations = () => {
  const queryClient = useQueryClient();

  const createReminder = useMutation({
    mutationFn: (data: CreateReminderDto) => remindersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
    },
  });

  const enviarReminder = useMutation({
    mutationFn: (id: string) => remindersApi.enviar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
    },
  });

  return { createReminder, enviarReminder };
};
