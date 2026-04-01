import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const pacienteSchema = z.object({
  nombre: z.string().min(2, 'Nombre requerido'),
  apellido: z.string().min(2, 'Apellido requerido'),
  documento: z.string().min(5, 'Documento requerido'),
  fechaNacimiento: z.string(),
  telefono: z.string().min(8, 'Teléfono requerido'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  sexo: z.string().optional(),
  direccion: z.string().optional()
});

interface PacienteFormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
  loading?: boolean;
}

export const PacienteForm: React.FC<PacienteFormProps> = ({ onSubmit, initialData, loading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(pacienteSchema),
    defaultValues: initialData || {}
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="flex flex-col gap-1">
          <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Nombre</label>
          <input {...register('nombre')} className="input" placeholder="Juan" />
          {errors.nombre && <span style={{ color: 'var(--danger)', fontSize: '0.75rem' }}>{String(errors.nombre.message)}</span>}
        </div>
        <div className="flex flex-col gap-1">
          <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Apellido</label>
          <input {...register('apellido')} className="input" placeholder="Pérez" />
          {errors.apellido && <span style={{ color: 'var(--danger)', fontSize: '0.75rem' }}>{String(errors.apellido.message)}</span>}
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1.5fr', gap: '1rem' }}>
        <div className="flex flex-col gap-1">
          <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Documento</label>
          <input {...register('documento')} className="input" placeholder="12.345.678" />
          {errors.documento && <span style={{ color: 'var(--danger)', fontSize: '0.75rem' }}>{String(errors.documento.message)}</span>}
        </div>
        <div className="flex flex-col gap-1">
          <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Fecha Nacimiento</label>
          <input type="date" {...register('fechaNacimiento')} className="input" />
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="flex flex-col gap-1">
          <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Teléfono</label>
          <input {...register('telefono')} className="input" placeholder="+54 11..." />
          {errors.telefono && <span style={{ color: 'var(--danger)', fontSize: '0.75rem' }}>{String(errors.telefono.message)}</span>}
        </div>
        <div className="flex flex-col gap-1">
          <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Email</label>
          <input type="email" {...register('email')} className="input" placeholder="juan@ejemplo.com" />
          {errors.email && <span style={{ color: 'var(--danger)', fontSize: '0.75rem' }}>{String(errors.email.message)}</span>}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Dirección</label>
        <input {...register('direccion')} className="input" placeholder="Av. Siempre Viva 742" />
      </div>

      <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '1rem' }}>
        {loading ? 'Guardando...' : initialData ? 'Actualizar Paciente' : 'Crear Paciente'}
      </button>
    </form>
  );
};
