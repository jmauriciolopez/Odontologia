export interface PlanTratamientoItem {
  id: string;
  planId: string;
  tipo: string;
  piezaPosicion?: number;
  cara?: string;
  precioRef: number;
  estado: 'pendiente' | 'realizado' | 'cancelado';
  createdAt: string;
  updatedAt: string;
}

export interface PlanTratamiento {
  id: string;
  pacienteId: string;
  profesionalId: string;
  nombre: string;
  notas?: string;
  estado: 'borrador' | 'activo' | 'completado' | 'cancelado';
  items: PlanTratamientoItem[];
  profesional?: {
    id: string;
    usuario: {
      nombre: string;
      apellido: string;
    }
  };
  paciente?: {
    id: string;
    nombre: string;
    apellido: string;
    documento?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreatePlanTratamientoDto {
  pacienteId: string;
  profesionalId: string;
  nombre: string;
  notas?: string;
  items: Partial<PlanTratamientoItem>[];
}
