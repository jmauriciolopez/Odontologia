import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useProfesionales, useConsultorios, useAgendaActions } from '../hooks/use-turnos';
import { usePacientes } from '../../pacientes/hooks/use-pacientes';
import { Turno, CreateTurnoDto } from '../types';
import { X, Calendar, Clock, User, Home, Search, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface TurnoFormModalProps {
  turno?: Turno; // If provided, we are editing
  initialDate?: Date;
  onClose: () => void;
}

export const TurnoFormModal: React.FC<TurnoFormModalProps> = ({ turno, initialDate, onClose }) => {
  const { data: profesionales = [] } = useProfesionales();
  const { data: consultorios = [] } = useConsultorios();
  const { createTurno, updateTurno, isCreating, isUpdating, deleteTurno, isDeleting } = useAgendaActions();

  const [searchTerm, setSearchTerm] = useState('');
  const { data: patients = [] } = usePacientes({ query: searchTerm });
  const [selectedPatientId, setSelectedPatientId] = useState(turno?.pacienteId || '');

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<CreateTurnoDto>({
    defaultValues: {
      pacienteId: turno?.pacienteId || '',
      profesionalId: turno?.profesionalId || '',
      consultorioId: turno?.consultorioId || '',
      fechaInicio: turno ? format(new Date(turno.fechaInicio), "yyyy-MM-dd'T'HH:mm") : (initialDate ? format(initialDate, "yyyy-MM-dd'T'HH:mm") : format(new Date(), "yyyy-MM-dd'T'HH:mm")),
      fechaFin: turno ? format(new Date(turno.fechaFin), "yyyy-MM-dd'T'HH:mm") : (initialDate ? format(new Date(initialDate.getTime() + 30 * 60000), "yyyy-MM-dd'T'HH:mm") : format(new Date(new Date().getTime() + 30 * 60000), "yyyy-MM-dd'T'HH:mm")),
      motivo: turno?.motivo || '',
      estado: turno?.estado || 'programado'
    }
  });

  const onFormSubmit = async (data: CreateTurnoDto) => {
    try {
      if (turno) {
        await updateTurno({ id: turno.id, data });
        toast.success('Turno actualizado');
      } else {
        await createTurno(data);
        toast.success('Turno creado correctamente');
      }
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Error al guardar el turno');
    }
  };

  const handleDelete = async () => {
    if (!turno) return;
    toast('¿Eliminar este turno?', {
      action: {
        label: 'Eliminar',
        onClick: async () => {
          await deleteTurno(turno.id);
          toast.success('Turno eliminado');
          onClose();
        },
      },
      cancel: { label: 'Cancelar', onClick: () => {} },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20 dark:border-slate-800"
      >
        {/* Header */}
        <div className="px-8 pt-8 pb-6 bg-gradient-to-br from-blue-600 to-indigo-700 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={20} />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
              <Calendar size={20} />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">
              {turno ? 'Editar Turno' : 'Agendar Nuevo Turno'}
            </h2>
          </div>
          <p className="text-white/70 text-sm font-medium"> Completa los datos para coordinar la atención clínica</p>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="p-8 space-y-6 max-h-[calc(100vh-16rem)] overflow-y-auto custom-scrollbar">

          {/* Patient Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Search size={14} /> Paciente
            </label>
            <div className="relative group">
              <input
                type="text"
                placeholder="Buscar por nombre o documento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 focus:bg-white dark:focus:bg-slate-900 transition-all text-slate-900 dark:text-white outline-none"
              />
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                 <Search size={16} />
              </div>

              {searchTerm && patients.length > 0 && !selectedPatientId && (
                <div className="absolute z-10 w-full mt-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden max-h-48 overflow-y-auto">
                  {patients.map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setSelectedPatientId(p.id);
                        setValue('pacienteId', p.id);
                        setSearchTerm(`${p.nombre} ${p.apellido}`);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors border-b last:border-0 border-slate-100 dark:border-slate-700 flex flex-col"
                    >
                      <span className="font-bold text-slate-900 dark:text-white text-sm">{p.nombre} {p.apellido}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">Doc: {p.documento}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {selectedPatientId && (
              <div className="flex items-center justify-between px-4 py-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded-xl text-xs font-bold border border-emerald-200/50 dark:border-emerald-500/20">
                <span>✓ Paciente Seleccionado</span>
                <button type="button" onClick={() => { setSelectedPatientId(''); setSearchTerm(''); setValue('pacienteId', ''); }} className="hover:underline">Cambiar</button>
              </div>
            )}
            <input type="hidden" {...register('pacienteId', { required: true })} />
          </div>

          {/* Dates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Clock size={14} /> Inicio
              </label>
              <input
                type="datetime-local"
                {...register('fechaInicio', { required: true })}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 focus:bg-white dark:focus:bg-slate-900 transition-all text-slate-900 dark:text-white outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Clock size={14} /> Fin
              </label>
              <input
                type="datetime-local"
                {...register('fechaFin', { required: true })}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 focus:bg-white dark:focus:bg-slate-900 transition-all text-slate-900 dark:text-white outline-none"
              />
            </div>
          </div>

          {/* Profesional and Consultorio Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <User size={14} /> Profesional
              </label>
              <select
                {...register('profesionalId', { required: true })}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-transparent focus:border-blue-500 transition-all text-slate-900 dark:text-white outline-none appearance-none"
              >
                <option value="">Seleccionar...</option>
                {profesionales.map(p => <option key={p.id} value={p.id}>{p.usuario.nombre} {p.usuario.apellido}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Home size={14} /> Consultorio
              </label>
              <select
                {...register('consultorioId', { required: true })}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-transparent focus:border-blue-500 transition-all text-slate-900 dark:text-white outline-none appearance-none"
              >
                <option value="">Seleccionar...</option>
                {consultorios.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </div>
          </div>

          {/* Motivo and Estado */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Estado</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {['programado', 'confirmado', 'atendido', 'cancelado'].map(est => (
                  <label
                    key={est}
                    className={cn(
                      "flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all text-[11px] font-bold uppercase tracking-tighter",
                      watch('estado') === est
                        ? "border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                        : "border-slate-100 dark:border-slate-800 text-slate-400 hover:border-slate-200"
                    )}
                  >
                    <input type="radio" value={est} {...register('estado')} className="hidden" />
                    {est}
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                Motivo / Notas
              </label>
              <textarea
                {...register('motivo')}
                placeholder="Indica el motivo de la consulta..."
                rows={3}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-transparent focus:border-blue-500 transition-all text-slate-900 dark:text-white outline-none resize-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-6 flex flex-col-reverse sm:flex-row gap-3">
            {turno && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 sm:flex-none px-6 py-3.5 text-rose-600 dark:text-rose-400 font-bold text-sm bg-rose-50 dark:bg-rose-500/10 rounded-2xl border border-rose-100 dark:border-rose-500/20 hover:bg-rose-100 transition-colors"
              >
                Eliminar
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3.5 text-slate-600 dark:text-slate-400 font-bold text-sm bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-200 transition-colors"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isCreating || isUpdating}
              className="flex-[2] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-xl shadow-blue-500/20 disabled:grayscale transition-all active:scale-95"
            >
              {isCreating || isUpdating ? 'Guardando...' : (turno ? 'Guardar Cambios' : 'Agendar Turno')}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
