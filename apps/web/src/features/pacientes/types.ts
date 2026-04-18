export interface Paciente {
  id: string;
  nombre: string;
  apellido: string;
  documento: string;
  fechaNacimiento: string;
  telefono: string;
  email?: string;
  direccion?: string;
  genero?: string;
  obraSocial?: string;
  nroAfiliado?: string;
  obraSocialId?: string;
  obraSocialData?: {
    id: string;
    nombre: string;
    prestaciones: {
      prestacionId: string;
      precio: number;
      prestacion: { id: string; codigo: string; nombre: string };
    }[];
  };
  createdAt: string;
  updatedAt: string;
  ficha?: FichaClinica;
}

export interface FichaClinica {
  id: string;
  pacienteId: string;
  motivoConsulta?: string;
  historiaPersonal?: string;
  antecedentes?: Antecedente[];
  evoluciones?: EvolucionClinica[];
  medicionesPeriodontales?: MedicionPeriodontal[];
}

export interface MedicionPeriodontal {
  id: string;
  fichaId: string;
  posicionDiente: number;
  profundidadVestibularDistal: number;
  profundidadVestibularMedio: number;
  profundidadVestibularMesial: number;
  recesionVestibularDistal: number;
  recesionVestibularMedio: number;
  recesionVestibularMesial: number;
  profundidadLingualDistal: number;
  profundidadLingualMedio: number;
  profundidadLingualMesial: number;
  recesionLingualDistal: number;
  recesionLingualMedio: number;
  recesionLingualMesial: number;
  sangrado: boolean;
  placa: boolean;
  movilidad: number;
  createdAt: string;
}

export interface Antecedente {
  id: string;
  descripcion: string;
  tipo: string;
  fechaRegistro: string;
}

export interface EvolucionClinica {
  id: string;
  descripcion: string;
  categoria?: string;
  fecha?: string | Date;
  fechaRegistro?: string | Date;
  createdAt?: string | Date;
}

export interface CreatePacienteDto {
  nombre: string;
  apellido: string;
  documento?: string;
  fechaNacimiento?: string;
  genero?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  obraSocial?: string;
  nroAfiliado?: string;
  obraSocialId?: string;
}

export type UpdatePacienteDto = Partial<CreatePacienteDto>;
