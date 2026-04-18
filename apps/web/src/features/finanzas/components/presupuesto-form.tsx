import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, DollarSign, List, User, Calendar, Link2, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { httpClient } from '@/lib/Httpclient';
import { PlanTratamiento } from '../../tratamientos/types';

interface PresupuestoFormProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
  loading: boolean;
  initialPacienteId?: string;
  initialPacienteNombre?: string;
}

export const PresupuestoForm: React.FC<PresupuestoFormProps> = ({
  onClose,
  onSubmit,
  loading,
  initialPacienteId = '',
  initialPacienteNombre = '',
}) => {
  const [items, setItems] = useState([{ descripcion: '', precioUnitario: 0, cantidad: 1, descuento: 0 }]);
  const [pacienteId, setPacienteId] = useState(initialPacienteId);
  const [planes, setPlanes] = useState<PlanTratamiento[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');

  useEffect(() => {
    if (!pacienteId) return;
    httpClient.get<PlanTratamiento[]>(`planes-tratamiento/paciente/${pacienteId}`)
      .then(setPlanes)
      .catch(() => {});
  }, [pacienteId]);

  const handleSelectPlan = (planId: string) => {
    setSelectedPlanId(planId);
    if (!planId) return;
    const plan = planes.find(p => p.id === planId);
    if (!plan?.items?.length) return;
    setItems(plan.items.map(item => ({
      descripcion: item.tipo,
      precioUnitario: Number(item.precioRef),
      cantidad: 1,
      descuento: 0,
    })));
  };

  const addItem = () => setItems([...items, { descripcion: '', precioUnitario: 0, cantidad: 1, descuento: 0 }]);
  const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));
  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const total = items.reduce((acc, item) => acc + ((Number(item.precioUnitario) || 0) * (Number(item.cantidad) || 1)), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      pacienteId,
      ...(selectedPlanId ? { planId: selectedPlanId } : {}),
      items: items.map(item => ({
        descripcion: item.descripcion,
        precioUnitario: Number(item.precioUnitario),
        cantidad: Number(item.cantidad),
        ...(Number(item.descuento) > 0 ? { descuento: Number(item.descuento) } : {}),
      })),
    });
  };

  const inputClasses = 'input-premium text-sm font-semibold';
  const selectedPlan = planes.find(p => p.id === selectedPlanId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-slate-900/40">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden"
        style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', color: 'var(--sb-text)' }}
      >
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                <Plus size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-[var(--sb-text)]">Nuevo Presupuesto</h2>
                <p className="text-xs font-bold text-[var(--sb-text-muted)] uppercase tracking-widest">DETALLES CLÍNICOS Y COSTOS</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="h-10 w-10 flex items-center justify-center rounded-full hover:opacity-80 text-[var(--sb-text-muted)] hover:text-rose-500 transition-all"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Paciente + Fecha */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-wider text-[var(--sb-text-muted)] ml-1 flex items-center gap-2">
                  <User size={12} />
                  Paciente
                </label>
                {initialPacienteNombre ? (
                  <div className={cn(inputClasses, 'bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20 text-blue-700 dark:text-blue-400 font-bold')}>
                    {initialPacienteNombre}
                  </div>
                ) : (
                  <input
                    type="text"
                    required
                    placeholder="ID del paciente..."
                    className={inputClasses}
                    value={pacienteId}
                    onChange={(e) => setPacienteId(e.target.value)}
                  />
                )}
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-wider text-[var(--sb-text-muted)] ml-1 flex items-center gap-2">
                  <Calendar size={12} />
                  Fecha de Emisión
                </label>
                <div className={cn(inputClasses, 'bg-slate-100 items-center flex text-[var(--sb-text-muted)]')}>
                  {new Date().toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Vincular con Plan de Tratamiento */}
            {pacienteId && (
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-wider text-[var(--sb-text-muted)] ml-1 flex items-center gap-2">
                  <Link2 size={12} />
                  Vincular con Plan de Tratamiento
                  <span className="text-[10px] font-medium normal-case tracking-normal opacity-60">(opcional)</span>
                </label>
                {planes.length === 0 ? (
                  <div className={cn(inputClasses, 'text-[var(--sb-text-muted)] opacity-60 italic')}>
                    Sin planes activos para este paciente
                  </div>
                ) : (
                  <select
                    className={cn(inputClasses, 'cursor-pointer')}
                    value={selectedPlanId}
                    onChange={(e) => handleSelectPlan(e.target.value)}
                  >
                    <option value="">— Sin vincular —</option>
                    {planes.map(plan => (
                      <option key={plan.id} value={plan.id}>
                        {plan.nombre} ({plan.items?.length ?? 0} procedimientos)
                      </option>
                    ))}
                  </select>
                )}
                {selectedPlan && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/50 dark:border-emerald-500/20"
                  >
                    <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                    <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                      Ítems importados desde "{selectedPlan.nombre}" — podés editarlos abajo
                    </span>
                  </motion.div>
                )}
              </div>
            )}

            {/* Items */}
            <div className="space-y-4">
              <div className="flex items-center justify-between ml-1">
                <label className="text-[11px] font-black uppercase tracking-wider text-[var(--sb-text-muted)] flex items-center gap-2">
                  <List size={12} />
                  Procedimientos y Tratamientos
                </label>
                <button
                  type="button"
                  onClick={addItem}
                  className="text-[10px] font-bold text-blue-600 hover:text-blue-500 uppercase tracking-widest flex items-center gap-1"
                >
                  <Plus size={12} />
                  Añadir Item
                </button>
              </div>

              <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                <AnimatePresence initial={false}>
                  {items.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="flex gap-3 group"
                    >
                      <input
                        className={cn(inputClasses, 'flex-1')}
                        placeholder="Descripción del tratamiento"
                        value={item.descripcion}
                        onChange={(e) => updateItem(index, 'descripcion', e.target.value)}
                        required
                      />
                      <div className="relative w-20">
                        <input
                          type="number"
                          min="1"
                          className={cn(inputClasses, 'text-center px-1')}
                          placeholder="Cant"
                          value={item.cantidad}
                          onChange={(e) => updateItem(index, 'cantidad', e.target.value)}
                          required
                        />
                      </div>
                      <div className="relative w-32">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--sb-text-muted)]" size={14} />
                        <input
                          type="number"
                          className={cn(inputClasses, 'pl-8 text-right')}
                          placeholder="0"
                          value={item.precioUnitario}
                          onChange={(e) => updateItem(index, 'precioUnitario', e.target.value)}
                          required
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        disabled={items.length === 1}
                        className="p-2.5 rounded-xl text-[var(--sb-border)] hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0"
                      >
                        <Trash2 size={18} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Total */}
            <div className="rounded-3xl p-6 border-2 border-dashed border-[var(--sb-border)]"
              style={{ background: 'var(--sb-active-bg)' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <DollarSign size={20} />
                  </div>
                  <span className="font-bold text-[var(--sb-text)]">Resumen</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[var(--sb-text-muted)]">Total a Facturar</span>
                  <span className="text-3xl font-black text-[var(--sb-text)] tracking-tighter">
                    ${total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3.5 rounded-2xl font-bold transition-all hover:opacity-80"
                style={{ background: 'var(--sb-active-bg)', border: '2px solid var(--sb-border)', color: 'var(--sb-text-muted)' }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white py-3.5 rounded-2xl font-bold shadow-lg shadow-blue-500/25 transition-all px-12"
              >
                {loading ? 'Generando...' : 'Generar Presupuesto'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
