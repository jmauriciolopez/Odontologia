import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { httpClient } from '../../../lib/Httpclient';
import { useAuth } from '../../../context/auth-context';

interface RegisterData {
  clinicaNombre: string;
  email: string;
  password: string;
  nombre: string;
  apellido: string;
}

interface RegisterResponse {
  access_token: string;
  user: any;
}

export const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (data: RegisterData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await httpClient.post<RegisterResponse>('auth/register', data);
      login(response.access_token, response.user);
      navigate('/', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Error al registrar la clínica. Verifique los datos.');
    } finally {
      setIsLoading(false);
    }
  };

  return { submit, isLoading, error };
};
