export interface Turno {
  id: string;
  pacienteId: string;
  profesionalId: string;
  consultorioId: string;
  fechaInicio: string;
  fechaFin: string;
  estado: 'programado' | 'confirmado' | 'atendido' | 'cancelado' | 'ausente';
  motivo?: string;
  paciente?: {
    id: string;
    nombre: string;
    apellido: string;
    telefono: string;
  };
  profesional?: {
    id: string;
    usuario: {
      nombre: string;
    };
  };
  consultorio?: {
    id: string;
    nombre: string;
  };
}

export interface TurnoFiltros {
  fecha?: string;
  profesionalId?: string;
  pacienteId?: string;
  estado?: string;
}

export interface DisponibilidadResponse {
  disponible: boolean;
  conflictos: Turno[];
}
