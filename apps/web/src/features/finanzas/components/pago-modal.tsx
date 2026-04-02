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
  const [monto, setMonto] = useState(presupuesto.total - (presupuesto.pagado || 0));
  const [metodo, setMetodo] = useState<'efectivo' | 'transferencia' | 'tarjeta'>('efectivo');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      presupuestoId: presupuesto.id,
      monto,
      metodoPago: metodo,
      fecha: new Date().toISOString()
    });
  };

  const saldoPendiente = presupuesto.total - (presupuesto.pagado || 0);

  const inputClasses = "w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-lg font-black text-slate-900 dark:text-white outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all text-center";

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
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-blue-900/20 overflow-hidden border border-slate-200/60 dark:border-slate-800"
      >
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                <Wallet size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Registrar Cobro</h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">FLUJO DE CAJA CLÍNICO</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-rose-500 transition-all font-black text-xl"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-8">
             {/* Presupuesto Summary */}
             <div className="bg-slate-50 dark:bg-slate-800/40 rounded-3xl p-6 border border-slate-100 dark:border-slate-800">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Total Presupuesto</span>
                    <span className="font-bold text-slate-900 dark:text-white">${presupuesto.total.toLocaleString()}</span>
                  </div>
                  <div className="flex flex-col gap-1 items-end">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Saldo Pendiente</span>
                    <span className="font-bold text-rose-500">${saldoPendiente.toLocaleString()}</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center gap-3">
                   <CheckCircle2 className="text-blue-500" size={16} />
                   <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                     Recibo: #{presupuesto.id.slice(0, 8).toUpperCase()}
                   </span>
                </div>
             </div>

             <form onSubmit={handleSubmit} className="space-y-8">
                {/* Amount Input */}
                <div className="space-y-3">
                   <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 text-center block">
                      Monto a Cobrar
                   </label>
                   <div className="relative">
                      <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={24} />
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
                   <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 ml-1">
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
                              : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:border-blue-400"
                          )}
                        >
                           <item.icon size={20} className={cn(metodo === item.id ? "text-white" : "text-slate-400 group-hover:text-blue-500")} />
                           <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
                        </button>
                      ))}
                   </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 pt-4">
                  <button 
                    type="button" 
                    onClick={onClose}
                    className="flex-1 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-600 dark:text-slate-300 py-4 rounded-2xl font-bold transition-all"
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
