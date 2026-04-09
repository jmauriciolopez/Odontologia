import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, DollarSign, Wallet, CreditCard, PieChart, CheckCircle2, ChevronRight, Activity } from 'lucide-react';
import { Presupuesto } from '../types';
import { cn } from '@/lib/utils';

interface PagoModalProps {
  presupuesto: Presupuesto;
  onClose: () => void;
  onSubmit: (data: any) => void;
  loading: boolean;
}

export const PagoModal: React.FC<PagoModalProps> = ({ presupuesto, onClose, onSubmit, loading }) => {
  const [monto, setMonto] = useState(presupuesto.total - (presupuesto.totalPagado || 0));
  const [metodo, setMetodo] = useState<'efectivo' | 'transferencia' | 'tarjeta'>('efectivo');
  const [notas, setNotas] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      presupuestoId: presupuesto.id,
      monto,
      metodoPago: metodo,
      ...(notas.trim() ? { notas } : {}),
    });
  };

  const saldoPendiente = presupuesto.total - (presupuesto.totalPagado || 0);

  const inputClasses = "input-premium text-lg font-black text-center";

  const metodos = [
    { id: 'efectivo', icon: DollarSign, label: 'Efectivo', color: 'blue' },
    { id: 'transferencia', icon: Activity, label: 'Transferencia', color: 'indigo' },
    { id: 'tarjeta', icon: CreditCard, label: 'Tarjeta', color: 'emerald' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-slate-900/40">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden"
        style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', color: 'var(--sb-text)' }}
      >
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                <Wallet size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-[var(--sb-text)]">Registrar Cobro</h2>
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--sb-text-muted)' }}>FLUJO DE CAJA CLÍNICO</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="h-10 w-10 flex items-center justify-center rounded-full hover:opacity-80 hover:text-rose-500 transition-all font-black text-xl"
              style={{ color: 'var(--sb-text-muted)' }}
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-8">
             {/* Presupuesto Summary */}
             <div className="rounded-3xl p-6 border border-[var(--sb-border)]"
               style={{ background: 'var(--sb-active-bg)' }}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: 'var(--sb-text-muted)' }}>Total Presupuesto</span>
                    <span className="font-bold text-[var(--sb-text)]">${presupuesto.total.toLocaleString()}</span>
                  </div>
                  <div className="flex flex-col gap-1 items-end">
                    <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: 'var(--sb-text-muted)' }}>Saldo Pendiente</span>
                    <span className="font-bold text-rose-500">${saldoPendiente.toLocaleString()}</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-[var(--sb-border)]/60 flex items-center gap-3">
                   <CheckCircle2 className="text-blue-500" size={16} />
                   <span className="text-xs font-semibold text-[var(--sb-text-muted)]">
                     Recibo: #{presupuesto.id.slice(0, 8).toUpperCase()}
                   </span>
                </div>
             </div>

             <form onSubmit={handleSubmit} className="space-y-8">
                {/* Amount Input */}
                <div className="space-y-3">
                   <label className="text-[11px] font-black uppercase tracking-wider text-center block" style={{ color: 'var(--sb-text-muted)' }}>
                      Monto a Cobrar
                   </label>
                   <div className="relative">
                      <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2" size={24} style={{ color: 'var(--sb-border)' }} />
                      <input
                        type="number"
                        step="0.01"
                        autoFocus
                        required
                        className={cn(inputClasses, "pl-12")}
                        value={monto}
                        onChange={(e) => setMonto(Number(e.target.value))}
                        max={saldoPendiente}
                      />
                   </div>
                   <div className="flex justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => setMonto(saldoPendiente)}
                        className="text-[10px] font-bold text-blue-600 hover:text-blue-500 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full transition-colors"
                      >
                         Cobrar Total Pendiente
                      </button>
                   </div>
                </div>

                {/* Method selection */}
                <div className="space-y-3">
                   <label className="text-[11px] font-black uppercase tracking-wider ml-1" style={{ color: 'var(--sb-text-muted)' }}>
                      Método de Pago
                   </label>
                   <div className="grid grid-cols-3 gap-3">
                      {metodos.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setMetodo(item.id as any)}
                          className={cn(
                            "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all group",
                            metodo === item.id
                              ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20"
                              : "border-[var(--sb-border)] text-[var(--sb-text-muted)] hover:border-blue-400"
                          )}
                        >
                           <item.icon size={20} className={cn(metodo === item.id ? "text-white" : "group-hover:text-blue-500")}
                             style={metodo !== item.id ? { color: 'var(--sb-text-muted)' } : {}} />
                           <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
                        </button>
                      ))}
                   </div>
                </div>

                {/* Notas */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-wider ml-1" style={{ color: 'var(--sb-text-muted)' }}>
                    Notas (opcional)
                  </label>
                  <input
                    type="text"
                    value={notas}
                    onChange={(e) => setNotas(e.target.value)}
                    placeholder="Ej: Pago en cuotas, recibo nro..."
                    className="input-premium text-sm font-medium"
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-4 rounded-2xl font-bold transition-all hover:opacity-80"
                    style={{ background: 'var(--sb-active-bg)', border: '2px solid var(--sb-border)', color: 'var(--sb-text-muted)' }}
                  >
                    Cerrar
                  </button>
                  <button
                    type="submit"
                    disabled={loading || monto <= 0}
                    className="flex-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-500/25 transition-all px-12"
                  >
                    {loading ? 'Sincronizando...' : 'Confirmar Cobro'}
                  </button>
                </div>
             </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
