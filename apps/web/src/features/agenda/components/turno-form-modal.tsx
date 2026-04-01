import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useProfesionales, useConsultorios } from '../hooks/use-turnos';
import { useDisponibilidad } from '../hooks/use-disponibilidad';

interface TurnoFormModalProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
  loading: boolean;
}

export const TurnoFormModal: React.FC<TurnoFormModalProps> = ({ onClose, onSubmit, loading }) => {
  const { data: profesionales = [] } = useProfesionales();
  const { data: consultorios = [] } = useConsultorios();
  
  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      fecha: new Date().toISOString().split('T')[0],
      horaInicio: '09:00',
      horaFin: '09:30',
      pacienteId: '',
      profesionalId: '',
      consultorioId: '',
      motivo: ''
    }
  });

  const formValues = watch();
  
  const { disponibilidad, loading: checkingDispo } = useDisponibilidad({
    fechaInicio: `${formValues.fecha}T${formValues.horaInicio}:00Z`,
    fechaFin: `${formValues.fecha}T${formValues.horaFin}:00Z`,
    profesionalId: formValues.profesionalId,
    consultorioId: formValues.consultorioId
  });

  const onFormSubmit = (data: any) => {
    const formattedData = {
      ...data,
      fechaInicio: `${data.fecha}T${data.horaInicio}:00Z`,
      fechaFin: `${data.fecha}T${data.horaFin}:00Z`
    };
    onSubmit(formattedData);
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div className="card" style={{ width: '100%', maxWidth: '500px', margin: '1rem' }}>
        <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem' }}>Agendar Nuevo Turno</h2>
          <button onClick={onClose} style={{ background: 'transparent', color: 'var(--text-muted)', fontSize: '1.25rem', padding: '0.25rem' }}>✕</button>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>ID Paciente (UUID)</label>
            <input {...register('pacienteId')} className="input" placeholder="ID del paciente..." required />
          </div>

          <div className="grid" style={{ gridTemplateColumns: '1.5fr 1fr 1fr', gap: '0.75rem' }}>
            <div className="flex flex-col gap-1">
              <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Fecha</label>
              <input type="date" {...register('fecha')} className="input" required />
            </div>
            <div className="flex flex-col gap-1">
              <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Inicio</label>
              <input type="time" {...register('horaInicio')} className="input" required />
            </div>
            <div className="flex flex-col gap-1">
              <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Fin</label>
              <input type="time" {...register('horaFin')} className="input" required />
            </div>
          </div>

          <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="flex flex-col gap-1">
              <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Profesional</label>
              <select {...register('profesionalId')} className="input" required>
                <option value="">Seleccionar...</option>
                {profesionales.map((p: any) => (
                  <option key={p.id} value={p.id}>{p.usuario?.nombre}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Consultorio</label>
              <select {...register('consultorioId')} className="input" required>
                <option value="">Seleccionar...</option>
                {consultorios.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
            </div>
          </div>

          {checkingDispo && <p className="text-muted" style={{ fontSize: '0.75rem' }}>🔍 Verificando disponibilidad...</p>}
          {disponibilidad && !disponibilidad.disponible && (
            <div style={{ padding: '0.75rem', background: 'rgba(239,68,68,0.1)', color: 'var(--danger)', borderRadius: 'var(--radius)', fontSize: '0.8125rem' }}>
              ⚠️ Conflicto detectado: {disponibilidad.conflictos.length} turno(s) en ese horario.
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Motivo</label>
            <textarea {...register('motivo')} className="input" rows={2} style={{ resize: 'none' }} />
          </div>

          <button type="submit" className="btn-primary" disabled={loading || (disponibilidad && !disponibilidad.disponible)} style={{ marginTop: '0.5rem' }}>
            {loading ? 'Confirmando...' : 'Agendar Turno'}
          </button>
        </form>
      </div>
    </div>
  );
};
