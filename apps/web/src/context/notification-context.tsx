import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './auth-context';
import { toast } from 'sonner';
import { queryClient } from '../lib/query-client';

interface NotificationContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:3002';

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, user } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!token) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
      return;
    }

    // Initialize socket with token
    const socket = io(SOCKET_URL, {
      auth: {
        token,
      },
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('[Socket] Connected');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('[Socket] Disconnected');
      setIsConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('[Socket] Connection error:', error);
      setIsConnected(false);
    });

    // Handle Agenda/Turno Update
    socket.on('agenda_update', (data: { turnoId: string; accion: string }) => {
      console.log('[Socket] Agenda actualizada:', data);
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['turnos'] });
      
      const message = data.accion === 'eliminado' 
        ? 'Un turno ha sido eliminado' 
        : `Un turno ha sido ${data.accion}`;

      toast.info(message, {
        description: `ID: ${data.turnoId.substring(0, 8)}...`,
        duration: 4000,
      });
    });

    // Handle Finanzas Update
    socket.on('finanzas_update', (data: { pacienteId: string; mensaje: string }) => {
      console.log('[Socket] Finanzas actualizadas:', data);
      
      // Invalidate financial and dashboard queries
      queryClient.invalidateQueries({ queryKey: ['presupuestos'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      queryClient.invalidateQueries({ queryKey: ['pacientes', data.pacienteId] });
      
      toast.success('Actualización financiera', {
        description: data.mensaje,
        duration: 5000,
      });
    });

    socketRef.current = socket;

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [token]);

  return (
    <NotificationContext.Provider value={{ socket: socketRef.current, isConnected }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
