import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  MapPin, 
  Trash2, 
  MoreVertical, 
  CheckCircle2, 
  XCircle,
  LayoutGrid,
  List as ListIcon
} from 'lucide-react';
import { useConsultorios, useAdminMutations } from '../hooks/use-admin';
import { PremiumCard } from '@/components/ui/premium-card';
import { cn } from '@/lib/utils';
import { Consultorio } from '../types';

export const ConsultoriosPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newConsultorioName, setNewConsultorioName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const { data: consultorios = [], isLoading } = useConsultorios();
  const { createConsultorio, deleteConsultorio, updateConsultorio } = useAdminMutations();

  const handleOpenEdit = (c: Consultorio) => {
    setEditingId(c.id);
    setNewConsultorioName(c.nombre);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setNewConsultorioName('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newConsultorioName.trim()) return;
    
    if (editingId) {
      updateConsultorio.mutate({ id: editingId, data: { nombre: newConsultorioName } }, {
        onSuccess: handleCloseModal
      });
    } else {
      createConsultorio.mutate({ nombre: newConsultorioName }, {
        onSuccess: handleCloseModal
      });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
            Consultorios & Sedes
          </h1>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-1">
            Gestión de espacios físicos y sillones dentales
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mr-2">
            <button 
              onClick={() => setViewMode('grid')}
              className={cn("p-2 rounded-lg transition-all", viewMode === 'grid' ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600" : "text-slate-400")}
            >
              <LayoutGrid size={18} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={cn("p-2 rounded-lg transition-all", viewMode === 'list' ? "bg-white dark:bg-slate-700 shadow-sm text-blue-600" : "text-slate-400")}
            >
              <ListIcon size={18} />
            </button>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95"
          >
            <Plus size={18} /> Nuevo Consultorio
          </button>
        </div>
      </header>

      {/* Grid View */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-48 rounded-3xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className={cn(
          "grid gap-6",
          viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4" : "grid-cols-1"
        )}>
          {consultorios.map((c) => (
            <PremiumCard key={c.id} className="group relative overflow-hidden">
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="h-12 w-12 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600">
                    <MapPin size={24} />
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleOpenEdit(c)}
                      className="p-2 text-slate-400 hover:text-blue-500 transition-colors"
                    >
                      <MoreVertical size={18} />
                    </button>
                    <button 
                      onClick={() => deleteConsultorio.mutate(c.id)}
                      className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">
                  {c.nombre}
                </h3>
                
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                  {c.activo ? (
                    <span className="flex items-center gap-1 text-emerald-500"><CheckCircle2 size={12} /> Operativo</span>
                  ) : (
                    <span className="flex items-center gap-1 text-slate-400"><XCircle size={12} /> Inactivo</span>
                  )}
                  <span className="h-1 w-1 rounded-full bg-slate-300 mx-1" />
                  <span className="text-slate-400 text-[9px]">ID: {c.id.slice(0, 8)}</span>
                </div>
              </div>

              <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
            </PremiumCard>
          ))}
        </div>
      )}

      {/* Modal for New/Edit Consultorio */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl p-10 overflow-hidden"
            >
              <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">
                {editingId ? 'Editar Espacio' : 'Nuevo Espacio'}
              </h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-8">
                {editingId ? 'Modifique los detalles del consultorio' : 'Define el nombre del consultorio o sillón'}
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 ml-1">Nombre / Identificador</label>
                  <input 
                    type="text"
                    autoFocus
                    value={newConsultorioName}
                    onChange={(e) => setNewConsultorioName(e.target.value)}
                    placeholder="Ej: Consultorio 01 / Quirófano"
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 py-4 px-6 rounded-2xl font-bold text-xs uppercase tracking-widest text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    disabled={createConsultorio.isPending || updateConsultorio.isPending}
                    className="flex-1 py-4 px-6 rounded-2xl bg-blue-600 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-50"
                  >
                    {editingId ? (updateConsultorio.isPending ? 'Guardando...' : 'Guardar') : (createConsultorio.isPending ? 'Creando...' : 'Crear Espacio')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
