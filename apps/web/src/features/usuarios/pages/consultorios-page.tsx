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
import { useConsultorios, useConsultorioMutations } from '../hooks/use-admin';
import { PremiumCard } from '@/components/ui/premium-card';
import { cn } from '@/lib/utils';
import { Consultorio } from '../types';

export const ConsultoriosPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    numeroSillones: 1,
    piso: '',
    telefono: '',
    whatsapp: '',
    horario: '',
    diasAtencion: [] as string[],
    activo: true
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: consultorios = [], isLoading } = useConsultorios();
  const { createConsultorio, deleteConsultorio, updateConsultorio } = useConsultorioMutations();

  // Filtrado de consultorios
  const filteredConsultorios = React.useMemo(() => {
    if (!searchTerm.trim()) return consultorios;
    const term = searchTerm.toLowerCase();
    return consultorios.filter(c => 
      c.nombre.toLowerCase().includes(term) ||
      (c.direccion && c.direccion.toLowerCase().includes(term))
    );
  }, [consultorios, searchTerm]);

  const diasSemana = [
    { label: 'L', value: 'Lunes' },
    { label: 'M', value: 'Martes' },
    { label: 'X', value: 'Miércoles' },
    { label: 'J', value: 'Jueves' },
    { label: 'V', value: 'Viernes' },
    { label: 'S', value: 'Sábado' },
    { label: 'D', value: 'Domingo' },
  ];

  const handleDayToggle = (day: string) => {
    setFormData(prev => ({
      ...prev,
      diasAtencion: prev.diasAtencion.includes(day)
        ? prev.diasAtencion.filter(d => d !== day)
        : [...prev.diasAtencion, day]
    }));
  };

  const handleOpenEdit = (c: Consultorio) => {
    setEditingId(c.id);
    setFormData({
      nombre: c.nombre,
      direccion: c.direccion || '',
      numeroSillones: c.numeroSillones || 1,
      piso: c.piso || '',
      telefono: c.telefono || '',
      whatsapp: c.whatsapp || '',
      horario: c.horario || '',
      diasAtencion: Array.isArray(c.diasAtencion) ? c.diasAtencion : [],
      activo: c.activo
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ 
      nombre: '', 
      direccion: '', 
      numeroSillones: 1, 
      piso: '', 
      telefono: '', 
      whatsapp: '', 
      horario: '',
      diasAtencion: [],
      activo: true 
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre.trim()) return;
    
    if (editingId) {
      updateConsultorio.mutate({ id: editingId, data: formData }, {
        onSuccess: handleCloseModal
      });
    } else {
      createConsultorio.mutate(formData, {
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
          <div className="relative group mr-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Buscar por nombre..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-100 dark:bg-slate-800 border-none rounded-xl py-2.5 pl-10 pr-4 text-xs font-bold outline-none w-64 focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mr-2">
            <button 
              onClick={() => setViewMode('grid')}
              className={cn("p-2 rounded-lg transition-all", viewMode === 'grid' ? "bg-white dark:bg-slate-700 shadow-sm text-primary" : "text-slate-400")}
            >
              <LayoutGrid size={18} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={cn("p-2 rounded-lg transition-all", viewMode === 'list' ? "bg-white dark:bg-slate-700 shadow-sm text-primary" : "text-slate-400")}
            >
              <ListIcon size={18} />
            </button>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl font-bold text-sm shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
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
        <>
          <div className={cn(
            "grid gap-6",
            viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4" : "grid-cols-1"
          )}>
            {filteredConsultorios.map((c: Consultorio) => (
              <PremiumCard key={c.id} className="group relative overflow-hidden h-full flex flex-col">
                <div className="p-8 flex-1">
                  <div className="flex items-start justify-between mb-6">
                    <div className="h-12 w-12 rounded-2xl bg-primary/5 dark:bg-primary/10 flex items-center justify-center text-primary">
                      <MapPin size={24} />
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleOpenEdit(c)}
                        className="p-2 text-slate-400 hover:text-primary transition-colors"
                      >
                        <MoreVertical size={18} />
                      </button>
                      <button 
                        onClick={() => {
                          if (confirm('¿Está seguro de eliminar este consultorio?')) {
                            deleteConsultorio.mutate(c.id);
                          }
                        }}
                        className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
                        {c.nombre}
                      </h3>
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest mt-1">
                        {c.activo ? (
                          <span className="flex items-center gap-1 text-emerald-500"><CheckCircle2 size={12} /> Operativo</span>
                        ) : (
                          <span className="flex items-center gap-1 text-slate-400"><XCircle size={12} /> Inactivo</span>
                        )}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-50 dark:border-white/5 space-y-4">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                         <span className="flex items-center gap-2"><span className="text-primary text-lg">💺</span> {c.numeroSillones || 1} Sillones</span>
                         {c.piso && <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md text-[9px]">Piso {c.piso}</span>}
                      </div>

                      <div className="space-y-1">
                        {c.horario && (
                          <div className="flex items-center gap-2 text-[11px] font-bold text-slate-900 dark:text-slate-300">
                            <span className="text-slate-400">🕒</span> {c.horario}
                          </div>
                        )}
                        {Array.isArray(c.diasAtencion) && c.diasAtencion.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {diasSemana.map(d => (
                              <span 
                                key={d.value}
                                className={cn(
                                  "text-[9px] px-1.5 py-0.5 rounded font-black uppercase",
                                  c.diasAtencion?.includes(d.value) 
                                    ? "bg-primary/10 text-primary" 
                                    : "text-slate-300 dark:text-slate-600"
                                )}
                              >
                                {d.label}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                         {c.direccion && (
                          <p className="text-[11px] font-medium text-slate-500 flex items-center gap-2">
                             <MapPin size={12} className="text-slate-300" />
                             {c.direccion}
                          </p>
                        )}
                        
                        <div className="flex flex-wrap gap-4 pt-1">
                          {c.telefono && (
                            <p className="text-[11px] font-medium text-slate-500 flex items-center gap-2">
                               <span className="text-slate-300 text-xs text-xs">📞</span>
                               {c.telefono}
                            </p>
                          )}
                          {c.whatsapp && (
                            <p className="text-[11px] font-medium text-emerald-600 flex items-center gap-2">
                               <span className="text-xs">📱</span>
                               {c.whatsapp}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-primary to-primary-foreground transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
              </PremiumCard>
            ))}
          </div>
          {filteredConsultorios.length === 0 && (
            <div className="medical-card p-20 text-center border-dashed border-slate-200">
               <MapPin size={48} className="mx-auto text-slate-200 mb-4" />
               <p className="text-slate-500 font-bold uppercase tracking-widest text-[11px]">
                {searchTerm ? 'No se encontraron sedes' : 'No hay sedes registradas'}
               </p>
               <p className="text-slate-400 text-xs mt-2">
                {searchTerm ? 'Intenta con otro término de búsqueda' : 'Comienza creando una nueva sede para tu organización.'}
               </p>
            </div>
          )}
        </>
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
              className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl p-10 overflow-hidden"
            >
              <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">
                {editingId ? 'Editar Sede' : 'Nueva Sede'}
              </h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-8">
                {editingId ? 'Modifique los detalles de la clínica o espacio' : 'Cree una nueva sede para su organización'}
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto px-2 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Fila 1 - Info Principal */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 ml-1">Nombre / Identificador</label>
                      <input 
                        type="text"
                        autoFocus
                        required
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        placeholder="Ej: Clínica Central / Consultorio Norte"
                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary transition-all outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 ml-1">Dirección Postale</label>
                      <input 
                        type="text"
                        value={formData.direccion}
                        onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                        placeholder="Av. Salud 123..."
                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary transition-all outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 ml-1">Piso / Nivel</label>
                        <input 
                          type="text"
                          value={formData.piso}
                          onChange={(e) => setFormData({ ...formData, piso: e.target.value })}
                          placeholder="PB / 1ro"
                          className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary transition-all outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 ml-1">Sillones</label>
                        <input 
                          type="number"
                          min="1"
                          value={formData.numeroSillones}
                          onChange={(e) => setFormData({ ...formData, numeroSillones: parseInt(e.target.value) || 1 })}
                          className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary transition-all outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Fila 2 - Atención y Contacto */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 ml-1">Días de Atención</label>
                      <div className="flex justify-between bg-slate-50 dark:bg-slate-800 p-2 rounded-2xl">
                        {diasSemana.map(day => (
                          <button
                            key={day.value}
                            type="button"
                            onClick={() => handleDayToggle(day.value)}
                            className={cn(
                              "h-10 w-10 rounded-xl font-black text-xs transition-all",
                              formData.diasAtencion.includes(day.value)
                                ? "bg-primary text-white shadow-lg shadow-primary/20"
                                : "text-slate-400 hover:bg-white dark:hover:bg-slate-700"
                            )}
                          >
                            {day.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 ml-1">Horario Operativo</label>
                      <input 
                        type="text"
                        value={formData.horario}
                        onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
                        placeholder="Ej: 08:30 - 13:00, 14:00 - 20:00"
                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary transition-all outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 ml-1">Teléfono</label>
                        <input 
                          type="text"
                          value={formData.telefono}
                          onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                          placeholder="+54 11..."
                          className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary transition-all outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 ml-1">WhatsApp</label>
                        <input 
                          type="text"
                          value={formData.whatsapp}
                          onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                          placeholder="+54 11..."
                          className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary transition-all outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-primary/5 dark:bg-white/5 rounded-2xl">
                      <input 
                        type="checkbox"
                        id="activo"
                        checked={formData.activo}
                        onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                        className="h-5 w-5 rounded border-slate-300 text-primary focus:ring-primary"
                      />
                      <label htmlFor="activo" className="text-xs font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest cursor-pointer select-none">
                        Sede Habilitada y Visible
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-8 border-t border-slate-100 dark:border-white/5">
                  <button 
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 py-4 px-6 rounded-2xl font-bold text-xs uppercase tracking-widest text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                  >
                    Descartar
                  </button>
                  <button 
                    type="submit"
                    disabled={createConsultorio.isPending || updateConsultorio.isPending}
                    className="flex-[2] py-4 px-6 rounded-2xl bg-primary text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 active:scale-95 transition-all disabled:opacity-50"
                  >
                    {editingId ? (updateConsultorio.isPending ? 'Sincronizando...' : 'Actualizar Sede') : (createConsultorio.isPending ? 'Procesando...' : 'Confirmar Nueva Sede')}
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
