export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  nombre?: string;
  apellido?: string;
  roles: string[];
}

export interface LoginResponse {
  access_token: string;
  user: AuthUser;
}
