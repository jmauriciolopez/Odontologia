import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { X, Save, Trash2, Loader2, Search, User } from 'lucide-react';
import { format, addMinutes, addMonths, parseISO } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import {
  Turno,
  CreateTurnoDto,
  CreateTurnosRecurrentesDto,
  FrecuenciaRecurrencia,
  FinSerieRecurrencia,
} from '../types';
import { useAgendaActions, useProfesionales, useConsultorios } from '../hooks/use-turnos';
import { useDisponibilidad } from '../hooks/use-disponibilidad';
import { pacientesApi } from '../../pacientes/api/pacientes-api';
import { Paciente } from '../../pacientes/types';
import { cn } from '@/lib/utils';

interface TurnoFormModalProps {
  turno?: Turno;
  initialDate?: Date;
  /** Precarga el paciente (p. ej. al venir desde la ficha con ?pacienteId=). */
  initialPacienteId?: string;
  onPacientePrefillClear?: () => void;
  onClose: () => void;
}

const ESTADOS = ['programado', 'confirmado', 'atendido', 'cancelado', 'ausente'] as const;

export const TurnoFormModal: React.FC<TurnoFormModalProps> = ({
  turno,
  initialDate,
  initialPacienteId,
  onPacientePrefillClear,
  onClose,
}) => {
  const isEdit = !!turno;
  const {
    createTurno,
    isCreating,
    createTurnosRecurrentes,
    isCreatingRecurrentes,
    updateTurno,
    isUpdating,
    deleteTurno,
    isDeleting,
  } = useAgendaActions();
  const { data: profesionales = [] } = useProfesionales();
  const { data: consultorios  = [] } = useConsultorios();

  const defaultStart = initialDate ?? (turno ? parseISO(turno.fechaInicio) : new Date());
  const defaultEnd   = turno ? parseISO(turno.fechaFin) : addMinutes(defaultStart, 30);

  const [form, setForm] = useState({
    pacienteId:    turno?.pacienteId    ?? '',
    profesionalId: turno?.profesionalId ?? '',
    consultorioId: turno?.consultorioId ?? '',
    fechaInicio:   format(defaultStart, "yyyy-MM-dd'T'HH:mm"),
    fechaFin:      format(defaultEnd,   "yyyy-MM-dd'T'HH:mm"),
    motivo:        turno?.motivo        ?? '',
    estado:        turno?.estado        ?? 'programado',
  });

  const [pacienteElegido, setPacienteElegido] = useState<Paciente | null>(() => turno?.paciente ?? null);
  const [busquedaPaciente, setBusquedaPaciente] = useState('');
  const [debouncedBusqueda, setDebouncedBusqueda] = useState('');
  const [listaAbierta, setListaAbierta] = useState(false);
  const buscadorRef = useRef<HTMLDivElement>(null);
  const usuarioQuitoPrefill = useRef(false);

  const [recurrente, setRecurrente] = useState(false);
  const [frecuencia, setFrecuencia] = useState<FrecuenciaRecurrencia>('semanal');
  const [finSerie, setFinSerie] = useState<FinSerieRecurrencia>('cantidad');
  const [hastaFecha, setHastaFecha] = useState(() => format(addMonths(new Date(), 2), 'yyyy-MM-dd'));
  const [cantidadSerie, setCantidadSerie] = useState(8);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedBusqueda(busquedaPaciente.trim()), 350);
    return () => clearTimeout(t);
  }, [busquedaPaciente]);

  useEffect(() => {
    const cerrar = (e: MouseEvent) => {
      if (buscadorRef.current && !buscadorRef.current.contains(e.target as Node)) {
        setListaAbierta(false);
      }
    };
    document.addEventListener('mousedown', cerrar);
    return () => document.removeEventListener('mousedown', cerrar);
  }, []);

  const { data: pacientesData, isFetching: buscandoPacientes } = useQuery({
    queryKey: ['pacientes', 'busqueda-turno', debouncedBusqueda],
    queryFn: () => pacientesApi.getPacientes({ query: debouncedBusqueda }),
    enabled: debouncedBusqueda.length >= 2,
  });
  const pacientesResultado = pacientesData?.data || [];

  const { data: pacientePrecargado } = useQuery({
    queryKey: ['paciente', initialPacienteId],
    queryFn: () => pacientesApi.getPacienteById(initialPacienteId!),
    enabled: !!initialPacienteId && !isEdit,
  });

  useEffect(() => {
    if (!pacientePrecargado || isEdit || usuarioQuitoPrefill.current) return;
    setPacienteElegido(prev => (prev ? prev : pacientePrecargado));
    setForm(f => (f.pacienteId ? f : { ...f, pacienteId: pacientePrecargado.id }));
  }, [pacientePrecargado, isEdit]);

  const seleccionarPaciente = (p: Paciente) => {
    setPacienteElegido(p);
    set('pacienteId', p.id);
    setBusquedaPaciente('');
    setListaAbierta(false);
  };

  const limpiarPaciente = () => {
    usuarioQuitoPrefill.current = true;
    setPacienteElegido(null);
    set('pacienteId', '');
    setBusquedaPaciente('');
    onPacientePrefillClear?.();
  };

  const { disponibilidad } = useDisponibilidad({
    fechaInicio:   form.fechaInicio,
    fechaFin:      form.fechaFin,
    profesionalId: form.profesionalId,
    consultorioId: form.consultorioId,
  });

  const set = (key: string, value: string) => setForm(f => ({ ...f, [key]: value }));

  const DEFAULT_DURACION_MIN = 30;

  /** Al mover el inicio se conserva la duración actual (inicio→fin); si no es válida, 30 min. El fin se puede editar después a mano. */
  const handleFechaInicioChange = (nuevaInicioStr: string) => {
    setForm(f => {
      const t0 = new Date(f.fechaInicio).getTime();
      const t1 = new Date(f.fechaFin).getTime();
      let durMs = t1 - t0;
      if (!Number.isFinite(durMs) || durMs <= 0) {
        durMs = DEFAULT_DURACION_MIN * 60 * 1000;
      }
      const inicio = new Date(nuevaInicioStr);
      const fin = new Date(inicio.getTime() + durMs);
      return {
        ...f,
        fechaInicio: nuevaInicioStr,
        fechaFin: format(fin, "yyyy-MM-dd'T'HH:mm"),
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    const dto: CreateTurnoDto = {
      pacienteId:    form.pacienteId,
      profesionalId: form.profesionalId,
      consultorioId: form.consultorioId,
      // Enviar como ISO pero preservando la hora local (sin conversión UTC)
      // "2025-04-13T10:00" → "2025-04-13T10:00:00.000Z" tratado como hora de clínica
      fechaInicio:   form.fechaInicio + ':00.000Z',
      fechaFin:      form.fechaFin   + ':00.000Z',
      motivo:        form.motivo || undefined,
      estado:        form.estado,
    };
    try {
      if (isEdit) {
        await updateTurno({ id: turno.id, data: dto });
      } else if (recurrente) {
        const recurrentDto: CreateTurnosRecurrentesDto = {
          ...dto,
          frecuencia,
          finSerie,
          ...(finSerie === 'fecha' ? { hastaFecha } : { cantidad: cantidadSerie }),
        };
        await createTurnosRecurrentes(recurrentDto);
      } else {
        await createTurno(dto);
      }
      onClose();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'No se pudo guardar.');
    }
  };

  const handleDelete = async () => {
    if (!turno) return;
    await deleteTurno(turno.id);
    onClose();
  };

  const isBusy = isCreating || isCreatingRecurrentes || isUpdating || isDeleting;
  const hasConflict = disponibilidad && !disponibilidad.disponible && !isEdit;
  const cantidadSerieOk =
    !recurrente ||
    finSerie !== 'cantidad' ||
    (cantidadSerie >= 2 && cantidadSerie <= 104);
  const puedeEnviar =
    form.pacienteId.trim().length > 0 && (!hasConflict || isEdit) && cantidadSerieOk;

  const inputCls = cn(
    'w-full px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors outline-none',
    'focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
  );

  const modal = (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
        style={{ background: 'var(--card-bg)', border: '1px solid var(--sb-border)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--sb-border)' }}>
          <h2 className="text-base font-bold" style={{ color: 'var(--sb-text)' }}>
            {isEdit ? 'Editar Turno' : 'Nuevo Turno'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:opacity-70 transition-opacity" style={{ color: 'var(--sb-text-muted)' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-widest mb-1.5 block" style={{ color: 'var(--sb-text-muted)' }}>
              Paciente
            </label>
            {pacienteElegido ? (
              <div
                className="flex items-center justify-between gap-3 rounded-xl border px-4 py-3"
                style={{ background: 'var(--sb-active-bg)', borderColor: 'var(--sb-border)' }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/15 text-blue-600">
                    <User size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold truncate" style={{ color: 'var(--sb-text)' }}>
                      {pacienteElegido.apellido}, {pacienteElegido.nombre}
                    </p>
                    <p className="text-[11px] truncate" style={{ color: 'var(--sb-text-muted)' }}>
                      {pacienteElegido.documento ? `DNI ${pacienteElegido.documento}` : 'Sin documento'}
                      {pacienteElegido.telefono ? ` · ${pacienteElegido.telefono}` : ''}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={limpiarPaciente}
                  className="shrink-0 text-xs font-bold uppercase tracking-wide text-blue-600 hover:text-blue-500"
                >
                  Cambiar
                </button>
              </div>
            ) : (
              <div ref={buscadorRef} className="relative">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 z-[1] -translate-y-1/2 text-[var(--sb-text-muted)]"
                  size={16}
                />
                <input
                  value={busquedaPaciente}
                  onChange={e => {
                    setBusquedaPaciente(e.target.value);
                    setListaAbierta(true);
                  }}
                  onFocus={() => setListaAbierta(true)}
                  placeholder="Buscar por nombre, apellido, DNI o teléfono…"
                  autoComplete="off"
                  className={cn(inputCls, 'pl-10')}
                  style={{ background: 'var(--sb-active-bg)', borderColor: 'var(--sb-border)', color: 'var(--sb-text)' }}
                />
                {busquedaPaciente.trim().length > 0 && busquedaPaciente.trim().length < 2 && (
                  <p className="mt-1.5 text-[11px] font-medium" style={{ color: 'var(--sb-text-muted)' }}>
                    Escribí al menos 2 caracteres para buscar.
                  </p>
                )}
                {listaAbierta && debouncedBusqueda.length >= 2 && (
                  <ul
                    className="absolute left-0 right-0 top-full z-20 mt-1 max-h-52 overflow-auto rounded-xl border py-1 shadow-xl"
                    style={{
                      background: 'var(--card-bg)',
                      borderColor: 'var(--sb-border)',
                    }}
                  >
                    {buscandoPacientes && (
                      <li className="flex items-center gap-2 px-3 py-2.5 text-xs font-medium" style={{ color: 'var(--sb-text-muted)' }}>
                        <Loader2 size={14} className="animate-spin" /> Buscando…
                      </li>
                    )}
                    {!buscandoPacientes && pacientesResultado.length === 0 && (
                      <li className="px-3 py-2.5 text-xs font-medium" style={{ color: 'var(--sb-text-muted)' }}>
                        No se encontraron pacientes.
                      </li>
                    )}
                    {!buscandoPacientes &&
                      pacientesResultado.map((p: any) => (
                        <li key={p.id}>
                          <button
                            type="button"
                            onClick={() => seleccionarPaciente(p)}
                            className="flex w-full flex-col items-start gap-0.5 px-3 py-2.5 text-left text-sm transition-colors hover:bg-blue-500/10"
                            style={{ color: 'var(--sb-text)' }}
                          >
                            <span className="font-bold">
                              {p.apellido}, {p.nombre}
                            </span>
                            <span className="text-[11px] font-medium" style={{ color: 'var(--sb-text-muted)' }}>
                              {p.documento ? `DNI ${p.documento}` : ''}
                              {p.telefono ? ` · ${p.telefono}` : ''}
                            </span>
                          </button>
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Profesional */}
          <div>
            <label className="text-xs font-bold uppercase tracking-widest mb-1.5 block" style={{ color: 'var(--sb-text-muted)' }}>
              Profesional
            </label>
            <select
              required
              value={form.profesionalId}
              onChange={e => set('profesionalId', e.target.value)}
              className={inputCls}
              style={{ background: 'var(--sb-active-bg)', borderColor: 'var(--sb-border)', color: 'var(--sb-text)' }}
            >
              <option value="">Seleccionar profesional</option>
              {profesionales.map(p => (
                <option key={p.id} value={p.id}>{p.usuario.nombre} {p.usuario.apellido}</option>
              ))}
            </select>
          </div>

          {/* Consultorio */}
          <div>
            <label className="text-xs font-bold uppercase tracking-widest mb-1.5 block" style={{ color: 'var(--sb-text-muted)' }}>
              Consultorio
            </label>
            <select
              required
              value={form.consultorioId}
              onChange={e => set('consultorioId', e.target.value)}
              className={inputCls}
              style={{ background: 'var(--sb-active-bg)', borderColor: 'var(--sb-border)', color: 'var(--sb-text)' }}
            >
              <option value="">Seleccionar consultorio</option>
              {consultorios.map(c => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
          </div>

          {/* Fecha/hora */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-widest mb-1.5 block" style={{ color: 'var(--sb-text-muted)' }}>
                Inicio
              </label>
              <input
                required type="datetime-local"
                value={form.fechaInicio}
                onChange={e => handleFechaInicioChange(e.target.value)}
                className={inputCls}
                style={{ background: 'var(--sb-active-bg)', borderColor: 'var(--sb-border)', color: 'var(--sb-text)' }}
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest mb-1.5 block" style={{ color: 'var(--sb-text-muted)' }}>
                Fin
              </label>
              <input
                required type="datetime-local"
                value={form.fechaFin}
                onChange={e => set('fechaFin', e.target.value)}
                className={inputCls}
                style={{ background: 'var(--sb-active-bg)', borderColor: 'var(--sb-border)', color: 'var(--sb-text)' }}
              />
              <p className="mt-1 text-[10px] font-medium leading-snug" style={{ color: 'var(--sb-text-muted)' }}>
                Podés modificar la hora de fin para alargar o acortar el turno.
              </p>
            </div>
          </div>

          {/* Estado (edit only) */}
          {isEdit && (
            <div>
              <label className="text-xs font-bold uppercase tracking-widest mb-1.5 block" style={{ color: 'var(--sb-text-muted)' }}>
                Estado
              </label>
              <select
                value={form.estado}
                onChange={e => set('estado', e.target.value)}
                className={inputCls}
                style={{ background: 'var(--sb-active-bg)', borderColor: 'var(--sb-border)', color: 'var(--sb-text)' }}
              >
                {ESTADOS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          )}

          {/* Motivo */}
          <div>
            <label className="text-xs font-bold uppercase tracking-widest mb-1.5 block" style={{ color: 'var(--sb-text-muted)' }}>
              Motivo (opcional)
            </label>
            <input
              value={form.motivo}
              onChange={e => set('motivo', e.target.value)}
              placeholder="Motivo de la consulta"
              className={inputCls}
              style={{ background: 'var(--sb-active-bg)', borderColor: 'var(--sb-border)', color: 'var(--sb-text)' }}
            />
          </div>

          {/* Serie recurrente (solo alta) */}
          {!isEdit && (
            <div
              className="rounded-2xl border p-4 space-y-3"
              style={{ borderColor: 'var(--sb-border)', background: 'var(--sb-active-bg)' }}
            >
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={recurrente}
                  onChange={e => {
                    setRecurrente(e.target.checked);
                    setSubmitError(null);
                  }}
                  className="rounded border-gray-400 w-4 h-4"
                />
                <span className="text-sm font-bold" style={{ color: 'var(--sb-text)' }}>
                  Serie recurrente
                </span>
              </label>
              <p className="text-[11px] font-medium leading-relaxed pl-7 -mt-1" style={{ color: 'var(--sb-text-muted)' }}>
                Se crean varios turnos con la misma duración; el primero es el inicio indicado arriba. Si algún horario
                choca con otro turno, no se guarda ninguno de la serie.
              </p>
              {recurrente && (
                <div className="space-y-3 pl-0 sm:pl-1 pt-1">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest mb-1.5 block" style={{ color: 'var(--sb-text-muted)' }}>
                      Frecuencia
                    </label>
                    <select
                      value={frecuencia}
                      onChange={e => setFrecuencia(e.target.value as FrecuenciaRecurrencia)}
                      className={inputCls}
                      style={{ background: 'var(--card-bg)', borderColor: 'var(--sb-border)', color: 'var(--sb-text)' }}
                    >
                      <option value="diaria">Cada día</option>
                      <option value="semanal">Cada semana</option>
                      <option value="quincenal">Cada 15 días</option>
                      <option value="mensual">Cada mes</option>
                    </select>
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest mb-2 block" style={{ color: 'var(--sb-text-muted)' }}>
                      Finalizar la serie
                    </span>
                    <div className="flex flex-col gap-2">
                      <label className="flex items-center gap-2 cursor-pointer text-sm font-medium" style={{ color: 'var(--sb-text)' }}>
                        <input
                          type="radio"
                          name="finSerie"
                          checked={finSerie === 'cantidad'}
                          onChange={() => { setFinSerie('cantidad'); setSubmitError(null); }}
                        />
                        Cantidad de turnos
                      </label>
                      {finSerie === 'cantidad' && (
                        <input
                          type="number"
                          min={2}
                          max={104}
                          value={cantidadSerie}
                          onChange={e => setCantidadSerie(Number.parseInt(e.target.value, 10) || 2)}
                          className={cn(inputCls, 'max-w-[120px]')}
                          style={{ background: 'var(--card-bg)', borderColor: 'var(--sb-border)', color: 'var(--sb-text)' }}
                        />
                      )}
                      <label className="flex items-center gap-2 cursor-pointer text-sm font-medium" style={{ color: 'var(--sb-text)' }}>
                        <input
                          type="radio"
                          name="finSerie"
                          checked={finSerie === 'fecha'}
                          onChange={() => { setFinSerie('fecha'); setSubmitError(null); }}
                        />
                        Hasta una fecha (inclusive)
                      </label>
                      {finSerie === 'fecha' && (
                        <input
                          type="date"
                          value={hastaFecha}
                          onChange={e => setHastaFecha(e.target.value)}
                          className={cn(inputCls, 'max-w-[200px]')}
                          style={{ background: 'var(--card-bg)', borderColor: 'var(--sb-border)', color: 'var(--sb-text)' }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Conflict warning */}
          {submitError && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-medium">
              <span className="shrink-0 mt-0.5">⚠️</span>
              {submitError}
            </div>
          )}

          {hasConflict && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-medium">
              <span className="shrink-0 mt-0.5">⚠️</span>
              Conflicto de horario detectado para este profesional o consultorio.
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between gap-3 pt-2">
            {isEdit && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isBusy}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-600 border border-rose-500/30 hover:bg-rose-500/10 transition-colors disabled:opacity-50"
              >
                {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                Eliminar
              </button>
            )}
            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-bold transition-colors"
                style={{ color: 'var(--sb-text-muted)', background: 'var(--sb-active-bg)' }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isBusy || !!hasConflict || !puedeEnviar}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 transition-all disabled:opacity-50"
              >
                {(isCreating || isCreatingRecurrentes || isUpdating) ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                {isEdit ? 'Guardar Cambios' : recurrente ? 'Crear serie' : 'Crear Turno'}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modal, document.body) : modal;
};
