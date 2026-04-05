import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { X, Loader2, User } from 'lucide-react';
import * as z from 'zod';
import { cn } from '@/lib/utils';

const pacienteSchema = z.object({
  nombre:          z.string().min(2, 'Nombre requerido'),
  apellido:        z.string().min(2, 'Apellido requerido'),
  documento:       z.string().optional(),
  fechaNacimiento: z.string().optional(),
  genero:          z.string().optional(),
  telefono:        z.string().optional(),
  email:           z.string().email('Email inválido').optional().or(z.literal('')),
  direccion:       z.string().optional(),
  obraSocial:      z.string().optional(),
  nroAfiliado:     z.string().optional(),
});

type PacienteFormValues = z.infer<typeof pacienteSchema>;

interface PacienteFormProps {
  onSubmit: (data: PacienteFormValues) => void;
  onClose: () => void;
  initialData?: Partial<PacienteFormValues>;
  loading?: boolean;
}

const Field: React.FC<{
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}> = ({ label, error, children, className }) => (
  <div className={cn('flex flex-col gap-1.5', className)}>
    <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
      {label}
    </label>
    {children}
    {error && <span className="text-[11px] font-medium text-rose-500">{error}</span>}
  </div>
);

const inputCls =
  'w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 px-4 py-2.5 text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 outline-none transition-all focus:border-blue-500/50 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-500/10';

export const PacienteForm: React.FC<PacienteFormProps> = ({
  onSubmit,
  onClose,
  initialData,
  loading,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PacienteFormValues>({
    resolver: zodResolver(pacienteSchema),
    defaultValues: {
      ...initialData,
      fechaNacimiento: initialData?.fechaNacimiento
        ? String(initialData.fechaNacimiento).slice(0, 10)
        : '',
    },
  });

  const isEdit = !!initialData?.nombre;

  // Strip empty strings so optional fields don't fail backend validation
  const handleFormSubmit = (values: PacienteFormValues) => {
    const clean = Object.fromEntries(
      Object.entries(values).filter(([, v]) => v !== '' && v !== undefined && v !== null)
    ) as PacienteFormValues;
    onSubmit(clean);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-8 py-6 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/20">
              <User size={18} />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white uppercase">
                {isEdit ? 'Editar Paciente' : 'Nuevo Paciente'}
              </h2>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                {isEdit ? 'Modificar datos del registro' : 'Afiliar nuevo paciente al sistema'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-8 space-y-6">

          <div className="grid grid-cols-2 gap-4">
            <Field label="Nombre *" error={errors.nombre?.message}>
              <input {...register('nombre')} placeholder="Juan" className={inputCls} />
            </Field>
            <Field label="Apellido *" error={errors.apellido?.message}>
              <input {...register('apellido')} placeholder="Pérez" className={inputCls} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Documento" error={errors.documento?.message}>
              <input {...register('documento')} placeholder="12.345.678" className={inputCls} />
            </Field>
            <Field label="Fecha de Nacimiento">
              <input type="date" {...register('fechaNacimiento')} className={inputCls} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Teléfono" error={errors.telefono?.message}>
              <input {...register('telefono')} placeholder="+54 11 1234-5678" className={inputCls} />
            </Field>
            <Field label="Email" error={errors.email?.message}>
              <input type="email" {...register('email')} placeholder="juan@ejemplo.com" className={inputCls} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Género">
              <select {...register('genero')} className={inputCls}>
                <option value="">Sin especificar</option>
                <option value="masculino">Masculino</option>
                <option value="femenino">Femenino</option>
                <option value="otro">Otro</option>
              </select>
            </Field>
            <Field label="Dirección">
              <input {...register('direccion')} placeholder="Av. Siempre Viva 742" className={inputCls} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Obra Social">
              <input {...register('obraSocial')} placeholder="OSDE, Swiss Medical..." className={inputCls} />
            </Field>
            <Field label="Nro. Afiliado">
              <input {...register('nroAfiliado')} placeholder="123456789" className={inputCls} />
            </Field>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 py-3 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-500 transition-colors disabled:opacity-60"
            >
              {loading
                ? <><Loader2 size={16} className="animate-spin" /> Guardando...</>
                : isEdit ? 'Guardar Cambios' : 'Crear Paciente'
              }
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
