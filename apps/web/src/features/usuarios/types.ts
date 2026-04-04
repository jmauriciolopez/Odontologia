export interface Usuario {
  id: string;
  email: string;
  nombre?: string;
  apellido?: string;
  activo: boolean;
  usuarioRoles: UsuarioRol[];
  createdAt: string;
  updatedAt: string;
}

export interface UsuarioRol {
  id: string;
  rolId: string;
  rol: {
    id: string;
    nombre: string;
  };
}

export interface CreateUsuarioDto {
  email: string;
  password?: string;
  nombre?: string;
  apellido?: string;
  rolIds?: string[];
}

export interface Consultorio {
  id: string;
  nombre: string;
  direccion?: string;
  numeroSillones?: number;
  piso?: string;
  telefono?: string;
  whatsapp?: string;
  horario?: string;
  diasAtencion?: string[];
  sucursalId?: string;
  activo: boolean;
}

export interface CreateConsultorioDto {
  nombre: string;
  direccion?: string;
  numeroSillones?: number;
  piso?: string;
  telefono?: string;
  whatsapp?: string;
  horario?: string;
  diasAtencion?: string[];
  sucursalId?: string;
  activo?: boolean;
}

export interface Profesional {
  id: string;
  usuarioId: string;
  usuario: {
    nombre: string;
    apellido: string;
    email: string;
  };
  especialidad?: string;
  matricula?: string;
}

export interface CreateProfesionalDto {
  usuarioId: string;
  especialidad?: string;
  matricula?: string;
}
