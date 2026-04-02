export interface Presupuesto {
  id: string;
  pacienteId: string;
  profesionalId: string;
  fechaEmision: string;
  total: number;
  subtotal: number;
  descuento: number;
  pagado: number;
  estado: 'pendiente' | 'aprobado' | 'rechazado' | 'pagado' | 'pagado_parcial';
  items: PresupuestoItem[];
  pagos?: Pago[];
  paciente?: {
    nombre: string;
    apellido: string;
  };
}

export interface PresupuestoItem {
  id: string;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface Pago {
  id: string;
  presupuestoId: string;
  monto: number;
  metodoPago: string;
  fechaPago: string;
  notas?: string;
}

export interface CreatePresupuestoDto {
  pacienteId: string;
  profesionalId: string;
  descuento?: number;
  items: {
    descripcion: string;
    cantidad: number;
    precioUnitario: number;
  }[];
}

export interface CreatePagoDto {
  presupuestoId: string;
  monto: number;
  metodoPago: string;
  notas?: string;
}
