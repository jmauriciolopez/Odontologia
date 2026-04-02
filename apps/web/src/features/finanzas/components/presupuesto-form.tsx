import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, DollarSign, List, User, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PresupuestoFormProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
  loading: boolean;
  initialPacienteId?: string;
}

export const PresupuestoForm: React.FC<PresupuestoFormProps> = ({ 
  onClose, 
  onSubmit, 
  loading,
  initialPacienteId = '' 
}) => {
  const [items, setItems] = useState([{ descripcion: '', precio: 0 }]);
  const [pacienteId, setPacienteId] = useState(initialPacienteId);

  const addItem = () => setItems([...items, { descripcion: '', precio: 0 }]);
  const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));
  
  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const total = items.reduce((acc, item) => acc + (Number(item.precio) || 0), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      pacienteId,
      items,
      total,
      fechaEmision: new Date().toISOString(),
    });
  };

  const inputClasses = "w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all placeholder:text-slate-400";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-slate-900/40">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-blue-900/20 overflow-hidden border border-slate-200/60 dark:border-slate-800"
      >
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                <Plus size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Nuevo Presupuesto</h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">DETALLES CLÍNICOS Y COSTOS</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-rose-500 transition-all"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Header info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 ml-1 flex items-center gap-2">
                  <User size={12} />
                  Paciente ID
                </label>
                <input
                  type="text"
                  required
                  placeholder="ID del paciente..."
                  className={inputClasses}
                  value={pacienteId}
                  onChange={(e) => setPacienteId(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 ml-1 flex items-center gap-2">
                  <Calendar size={12} />
                  Fecha de Emisión
                </label>
                <div className={cn(inputClasses, "bg-slate-100 items-center flex text-slate-500")}>
                  {new Date().toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Items section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between ml-1">
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
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
                        className={cn(inputClasses, "flex-1")}
                        placeholder="Descripción del tratamiento (ej: Limpieza Dental)"
                        value={item.descripcion}
                        onChange={(e) => updateItem(index, 'descripcion', e.target.value)}
                        required
                      />
                      <div className="relative w-32">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input
                          type="number"
                          className={cn(inputClasses, "pl-8 text-right")}
                          placeholder="0"
                          value={item.precio}
                          onChange={(e) => updateItem(index, 'precio', e.target.value)}
                          required
                        />
                      </div>
                      <button 
                        type="button" 
                        onClick={() => removeItem(index)}
                        disabled={items.length === 1}
                        className="p-2.5 rounded-xl text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0"
                      >
                        <Trash2 size={18} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Total Display */}
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-6 border-2 border-dashed border-slate-200 dark:border-slate-700">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
                       <DollarSign size={20} />
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white">Resumen Mensual</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Total a Facturar</span>
                    <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">
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
                className="flex-1 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-600 dark:text-slate-300 py-3.5 rounded-2xl font-bold transition-all"
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
