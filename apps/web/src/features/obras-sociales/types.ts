export interface ObraSocial {
  id: string;
  nombre: string;
  codigo?: string;
  descripcion?: string;
  activo: boolean;
  prestaciones?: ObraSocialPrestacion[];
  createdAt: string;
}

export interface ObraSocialPrestacion {
  id: string;
  obraSocialId: string;
  prestacionId: string;
  precio: number;
  prestacion: {
    id: string;
    codigo: string;
    nombre: string;
    honorarios: number;
  };
}

export interface CreateObraSocialDto {
  nombre: string;
  codigo?: string;
  descripcion?: string;
}

export interface UpsertPreciosDto {
  precios: { prestacionId: string; precio: number }[];
}
