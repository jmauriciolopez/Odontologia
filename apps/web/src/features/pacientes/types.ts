export interface Paciente {
  id: string;
  nombre: string;
  apellido: string;
  documento: string;
  fechaNacimiento: string;
  telefono: string;
  email?: string;
  direccion?: string;
  sexo?: string;
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
  fechaRegistro: string;
}
