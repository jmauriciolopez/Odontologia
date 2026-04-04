import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { httpClient } from '../../../lib/Httpclient';
import { useAuth } from '../../../context/auth-context';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
  user: any;
}

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await httpClient.post<LoginResponse>('auth/login', credentials);
      login(response.access_token, response.user);
      navigate('/', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Credenciales inválidas');
    } finally {
      setIsLoading(false);
    }
  };

  return { submit, isLoading, error };
};
