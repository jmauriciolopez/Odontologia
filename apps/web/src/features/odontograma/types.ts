export interface PiezaDental {
  id: string;
  fichaId: string;
  posicion: number;
  caras: {
    vestibular: string;
    lingual: string;
    oclusal: string;
    distal: string;
    mesial: string;
  };
  procedimientos?: ProcedimientoPieza[];
}

export interface ProcedimientoPieza {
  id: string;
  piezaId: string;
  tipo: string;
  cara?: string;
  observaciones?: string;
  fechaRealizacion: string;
}

export interface UpdatePiezaDto {
  piezaId: string;
  caras?: Partial<PiezaDental['caras']>;
}

export interface AddProcedimientoDto {
  piezaId: string;
  tipo: string;
  cara?: string;
  observaciones?: string;
}
