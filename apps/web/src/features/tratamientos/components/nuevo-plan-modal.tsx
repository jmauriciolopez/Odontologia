import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, Activity, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProfesionales } from '../../agenda/hooks/use-turnos';
import { CreatePlanTratamientoDto } from '../types';
import { httpClient } from '@/lib/Httpclient';

interface Prestacion {
  id: string;
  codigo: string;
  nombre: string;
  categoria?: string;
  honorarios: number;
}

interface NuevoPlanModalProps {
  pacienteId: string;
  onClose: () => void;
  onSubmit: (data: CreatePlanTratamientoDto) => Promise<void>;
  loading?: boolean;
}

const inputCls = 'input-premium py-2.5 px-4 text-sm';

export const NuevoPlanModal: React.FC<NuevoPlanModalProps> = ({
  pacienteId, onClose, onSubmit, loading,
}) => {
  const { data: profesionales = [] } = useProfesionales();
  const [prestaciones, setPrestaciones] = useState<Prestacion[]>([]);
  const [nombre, setNombre]           = useState('');
  const [profesionalId, setProfesionalId] = useState('');
  const [notas, setNotas]             = useState('');
  const [items, setItems] = useState([{ tipo: '', prestacionId: '', precioRef: 0, piezaPosicion: '', cara: '' }]);

  useEffect(() => {
    httpClient.get<Prestacion[]>('configuracion/prestaciones').then(setPrestaciones).catch(() => {});
  }, []);

  const addItem    = () => setItems(p => [...p, { tipo: '', prestacionId: '', precioRef: 0, piezaPosicion: '', cara: '' }]);
  const removeItem = (i: number) => setItems(p => p.filter((_, idx) => idx !== i));
  const updateItem = (i: number, field: string, value: any) =>
    setItems(p => p.map((item, idx) => idx === i ? { ...item, [field]: value } : item));

  const handleSelectPrestacion = (i: number, prestacionId: string) => {
    const p = prestaciones.find(x => x.id === prestacionId);
    if (!p) return;
    setItems(prev => prev.map((item, idx) => idx === i
      ? { ...item, prestacionId: p.id, tipo: `${p.codigo} - ${p.nombre}`, precioRef: Number(p.honorarios) }
      : item
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      pacienteId,
      profesionalId,
      nombre,
      notas: notas.trim() || undefined,
      items: items
        .filter(it => it.tipo.trim())
        .map(it => ({
          tipo:          it.tipo,
          precioRef:     Number(it.precioRef),
          piezaPosicion: it.piezaPosicion ? Number(it.piezaPosicion) : undefined,
          cara:          it.cara || undefined,
        })),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl"
        style={{ background: 'var(--card-bg)', border: '1px solid var(--sb-border)', color: 'var(--sb-text)' }}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-8 py-6 border-b border-[var(--sb-border)]"
          style={{ background: 'var(--card-bg)' }}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-lg"
              style={{ background: 'var(--brand-500, #6d7bff)' }}>
              <Activity size={18} />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight uppercase" style={{ color: 'var(--sb-text)' }}>
                Nuevo Plan de Tratamiento
              </h2>
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--sb-text-muted)' }}>
                Hoja de ruta clínica del paciente
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:opacity-80 transition-colors"
            style={{ color: 'var(--sb-text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Nombre del plan */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--sb-text-muted)' }}>
              Nombre del Plan *
            </label>
            <input
              required
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              placeholder="Ej: Rehabilitación Oral Completa"
              className={inputCls}
            />
          </div>

          {/* Profesional */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--sb-text-muted)' }}>
              Profesional Responsable *
            </label>
            <select
              required
              value={profesionalId}
              onChange={e => setProfesionalId(e.target.value)}
              className={cn(inputCls, 'appearance-none')}
            >
              <option value="">Seleccionar profesional...</option>
              {profesionales.map(p => (
                <option key={p.id} value={p.id}>
                  Dr. {p.usuario.nombre} {p.usuario.apellido}
                </option>
              ))}
            </select>
          </div>

          {/* Items */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--sb-text-muted)' }}>
                Procedimientos
              </label>
              <button type="button" onClick={addItem}
                className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 hover:opacity-80"
                style={{ color: 'var(--brand-500, #6d7bff)' }}>
                <Plus size={12} /> Agregar
              </button>
            </div>

            <div className="space-y-3">
              {/* Header labels */}
              <div className="hidden sm:grid grid-cols-[1fr_80px_100px_90px_32px] gap-2 px-1">
                {['Procedimiento *', 'Pieza', 'Cara', 'Precio $', ''].map(h => (
                  <span key={h} className="text-[9px] font-black uppercase tracking-widest" style={{ color: 'var(--sb-text-muted)' }}>{h}</span>
                ))}
              </div>

              {items.map((item, i) => (
                <div key={i} className="grid grid-cols-[1fr_80px_100px_90px_32px] gap-2 group items-center">
                  <select
                    value={item.prestacionId}
                    onChange={e => handleSelectPrestacion(i, e.target.value)}
                    className={cn(inputCls, 'appearance-none')}
                  >
                    <option value="">Seleccionar prestación...</option>
                    {Object.entries(
                      prestaciones.reduce((acc, p) => {
                        const cat = p.categoria || 'Sin categoría';
                        if (!acc[cat]) acc[cat] = [];
                        acc[cat].push(p);
                        return acc;
                      }, {} as Record<string, Prestacion[]>)
                    ).map(([cat, items]) => (
                      <optgroup key={cat} label={cat}>
                        {items.map(p => (
                          <option key={p.id} value={p.id}>
                            {p.codigo} — {p.nombre}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  <input
                    type="number"
                    placeholder="Nº"
                    min="11" max="48"
                    value={item.piezaPosicion}
                    onChange={e => updateItem(i, 'piezaPosicion', e.target.value)}
                    className={cn(inputCls, 'text-center')}
                  />
                  <select
                    value={item.cara}
                    onChange={e => updateItem(i, 'cara', e.target.value)}
                    className={cn(inputCls, 'appearance-none')}
                  >
                    <option value="">Todas</option>
                    <option value="vestibular">Vestibular</option>
                    <option value="lingual">Lingual</option>
                    <option value="oclusal">Oclusal</option>
                    <option value="mesial">Mesial</option>
                    <option value="distal">Distal</option>
                  </select>
                  <input
                    type="number"
                    placeholder="0"
                    min="0"
                    value={item.precioRef}
                    onChange={e => updateItem(i, 'precioRef', e.target.value)}
                    className={cn(inputCls, 'text-right')}
                  />
                  <button
                    type="button"
                    onClick={() => removeItem(i)}
                    disabled={items.length === 1}
                    className="p-1.5 rounded-lg hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-0"
                    style={{ color: 'var(--sb-text-muted)' }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}

              {/* Total */}
              {items.length > 0 && (
                <div className="flex justify-end pt-2 border-t border-[var(--sb-border)]">
                  <span className="text-xs font-bold" style={{ color: 'var(--sb-text-muted)' }}>
                    Total estimado:&nbsp;
                    <span style={{ color: 'var(--sb-text)' }}>
                      ${items.reduce((acc, it) => acc + Number(it.precioRef || 0), 0).toLocaleString('es-AR')}
                    </span>
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Notas */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--sb-text-muted)' }}>
              Notas Clínicas (opcional)
            </label>
            <textarea
              rows={3}
              value={notas}
              onChange={e => setNotas(e.target.value)}
              placeholder="Observaciones generales del plan..."
              className={cn(inputCls, 'resize-none')}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2 border-t border-[var(--sb-border)]">
            <button type="button" onClick={onClose}
              className="flex-1 rounded-xl py-3 text-sm font-bold hover:opacity-80 transition-colors border border-[var(--sb-border)]"
              style={{ color: 'var(--sb-text-muted)' }}>
              Cancelar
            </button>
            <button type="submit" disabled={loading}
              className="flex-[2] btn-primary flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold disabled:opacity-60">
              {loading
                ? <><Loader2 size={15} className="animate-spin" /> Creando...</>
                : 'Crear Plan de Tratamiento'
              }
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
