export interface JwtPayload {
  sub: string;
  email: string;
  roles: string[];
  clinicaId?: string;
}
