import React from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  Users,
  Stethoscope,
  Award,
  Trash2,
  ExternalLink,
  ChevronRight,
  Filter,
  MoreVertical,
  Edit3,
  Save,
  X
} from 'lucide-react';
import { useProfesionales, useProfesionalMutations } from '../hooks/use-admin';
import { AnimatePresence } from 'framer-motion';
import { Profesional } from '../types';
import { PremiumCard } from '@/components/ui/premium-card';
import { cn } from '@/lib/utils';

export const ProfesionalesPage: React.FC = () => {
  const { data: profesionales = [], isLoading } = useProfesionales();
  const { deleteProfesional, updateProfesional } = useProfesionalMutations();

  // Estados para Búsqueda y Modal
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingProfesional, setEditingProfesional] = React.useState<Profesional | null>(null);

  // Filtrado de profesionales (Búsqueda por valores claros)
  const filteredProfesionales = React.useMemo(() => {
    if (!searchTerm.trim()) return profesionales;
    const term = searchTerm.toLowerCase();
    return profesionales.filter(p =>
      p.usuario.nombre.toLowerCase().includes(term) ||
      p.usuario.apellido.toLowerCase().includes(term) ||
      (p.especialidad && p.especialidad.toLowerCase().includes(term))
    );
  }, [profesionales, searchTerm]);

  const handleOpenEdit = (p: Profesional) => {
    setEditingProfesional(p);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProfesional(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
            Cuerpo Médico
          </h1>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-1">
            Gestión de especialistas y disponibilidad clínica
          </p>
        </div>

         <div className="flex items-center gap-2">
            <div className="relative group">
               <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={16} />
               <input
                 type="text"
                 placeholder="Buscar por nombre o especialidad..."
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="bg-slate-100 dark:bg-slate-800 border-none rounded-2xl py-3 pl-10 pr-4 text-xs font-bold outline-none w-64 focus:ring-2 focus:ring-blue-500/20 transition-all"
               />
            </div>
           <button className="p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
              <MoreVertical size={20} />
           </button>
        </div>
      </header>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 rounded-3xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : (
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           {filteredProfesionales.map((p) => (
             <PremiumCard key={p.id} className="group hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300">
               <div className="p-6 flex items-center gap-6">
                <div className="h-16 w-16 rounded-3xl bg-gradient-to-br from-slate-100 to-white dark:from-slate-800 dark:to-slate-900 border border-slate-100 dark:border-slate-700 flex items-center justify-center font-black text-xl text-blue-600 shadow-inner">
                  {p.usuario.nombre[0]}{p.usuario.apellido[0]}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-tight truncate">
                      Dr. {p.usuario.nombre} {p.usuario.apellido}
                    </h3>
                    <div className="px-2 py-0.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg text-[9px] font-black uppercase tracking-widest whitespace-nowrap">
                      {p.especialidad || 'General'}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span className="flex items-center gap-1.5"><Award size={14}/> MN: {p.matricula || '---'}</span>
                    <span className="h-1 w-1 rounded-full bg-slate-300" />
                    <span className="flex items-center gap-1.5"><Stethoscope size={14}/> Sede Principal</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                   <button
                    onClick={() => {
                      toast('¿Eliminar este profesional?', {
                        action: {
                          label: 'Eliminar',
                          onClick: () => deleteProfesional.mutate(p.id),
                        },
                        cancel: { label: 'Cancelar', onClick: () => {} },
                      });
                    }}
                    className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-2xl transition-all opacity-0 group-hover:opacity-100"
                   >
                     <Trash2 size={20} />
                   </button>
                   <button
                    onClick={() => handleOpenEdit(p)}
                    className="p-3 text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
                   >
                     <Edit3 size={20} />
                   </button>
                </div>
              </div>
            </PremiumCard>
          ))}
        </div>
      )}

      <EditProfesionalModal
        isOpen={isModalOpen}
        profesional={editingProfesional}
        onClose={handleCloseModal}
        onSave={async (data) => { await updateProfesional.mutateAsync({ id: editingProfesional!.id, data }); }}
        isSaving={updateProfesional.isPending}
      />

      {filteredProfesionales.length === 0 && !isLoading && (
        <div className="medical-card p-20 text-center border-dashed border-slate-200">
           <Stethoscope size={48} className="mx-auto text-slate-200 mb-4" />
           <p className="text-slate-500 font-bold uppercase tracking-widest text-[11px]">
            {searchTerm ? 'No se encontraron especialistas' : 'No hay profesionales registrados'}
           </p>
           <p className="text-slate-400 text-xs mt-2">
            {searchTerm ? 'Intenta con otro término de búsqueda' : 'Los usuarios con rol de Doctor aparecerán aquí proactivamente.'}
           </p>
        </div>
      )}
    </div>
  );
};

// Componente Modal de Edición (Movido para estabilidad de hooks)
interface EditModalProps {
  isOpen: boolean;
  profesional: Profesional | null;
  onClose: () => void;
  onSave: (data: { especialidad: string; matricula: string }) => Promise<void>;
  isSaving: boolean;
}

const EditProfesionalModal: React.FC<EditModalProps> = ({ isOpen, profesional, onClose, onSave, isSaving }) => {
  const [formData, setFormData] = React.useState({
    especialidad: '',
    matricula: ''
  });

  React.useEffect(() => {
    if (profesional) {
      setFormData({
        especialidad: profesional.especialidad || '',
        matricula: profesional.matricula || ''
      });
    }
  }, [profesional]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl p-10 overflow-hidden"
          >
            <div className="flex items-start justify-between mb-8">
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  Editar Perfil
                </h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                  Dr. {profesional?.usuario.nombre} {profesional?.usuario.apellido}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Especialidad</label>
                  <input
                    type="text"
                    value={formData.especialidad}
                    onChange={(e) => setFormData({...formData, especialidad: e.target.value})}
                    placeholder="Ej: Ortodoncia, Implantología..."
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-blue-500/20 focus:bg-white dark:focus:bg-slate-800 rounded-2xl py-4 px-6 text-sm font-bold transition-all outline-none"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Matrícula Nacional/Provincial</label>
                  <input
                    type="text"
                    value={formData.matricula}
                    onChange={(e) => setFormData({...formData, matricula: e.target.value})}
                    placeholder="Nro. de Matrícula"
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-blue-500/20 focus:bg-white dark:focus:bg-slate-800 rounded-2xl py-4 px-6 text-sm font-bold transition-all outline-none"
                    required
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-4 px-6 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-[2] bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-4 px-6 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all"
                >
                  {isSaving ? 'Guardando...' : (
                    <>
                      <Save size={16} />
                      Guardar Cambios
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
