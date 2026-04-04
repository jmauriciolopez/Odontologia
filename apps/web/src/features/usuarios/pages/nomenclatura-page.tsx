import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Database, 
  Settings as SettingsIcon, 
  Save, 
  CheckCircle2, 
  Palette, 
  Hash,
  Activity,
  Plus,
  Trash2,
  Edit,
  Search,
  Bell
} from 'lucide-react';
import { PremiumCard } from '../../../components/ui/premium-card';
import { httpClient } from '../../../lib/Httpclient';

export const NomenclaturaPage: React.FC = () => {
  const [config, setConfig] = useState<any>(null);
  const [prestaciones, setPrestaciones] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'colores' | 'nomenclador'>('colores');
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchData = async () => {
    try {
      const [configRes, prestacionesRes] = await Promise.all([
        httpClient.get<any>('configuracion'),
        httpClient.get<any[]>('configuracion/prestaciones')
      ]);
      setConfig(configRes);
      setPrestaciones(prestacionesRes);
    } catch (error) {
      showNotification('error', 'Error al cargar la configuración');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPrestaciones = React.useMemo(() => {
    if (!searchTerm.trim()) return prestaciones;
    const term = searchTerm.toLowerCase();
    return prestaciones.filter(p => 
      p.nombre.toLowerCase().includes(term) || 
      p.codigo.toLowerCase().includes(term) ||
      (p.descripcion && p.descripcion.toLowerCase().includes(term))
    );
  }, [prestaciones, searchTerm]);

  const handleUpdateConfig = async (newData: any) => {
    setIsSaving(true);
    try {
      const res = await httpClient.patch<any>('configuracion', newData);
      setConfig(res);
      showNotification('success', 'Configuración actualizada');
    } catch (error) {
      showNotification('error', 'Error al guardar');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-20 text-center uppercase font-black tracking-widest animate-pulse text-slate-400">Sincronizando Archivos Clínicos...</div>;

  return (
    <div className="flex flex-col gap-10 pb-20">
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`fixed top-10 left-1/2 -translate-x-1/2 z-[100] px-6 py-4 rounded-3xl shadow-2xl backdrop-blur-xl border flex items-center gap-4 ${
              notification.type === 'success' 
                ? 'bg-emerald-500/90 border-emerald-400 text-white' 
                : 'bg-rose-500/90 border-rose-400 text-white'
            }`}
          >
            <div className="p-2 bg-white/20 rounded-xl">
              {notification.type === 'success' ? <CheckCircle2 size={20} /> : <Bell size={20} />}
            </div>
            <span className="text-sm font-black uppercase tracking-widest">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-500 text-white rounded-xl shadow-lg shadow-orange-500/20">
              <Database size={20} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Administración Clínica</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase"
          >
            Nomenclatura y Configuración
          </motion.h1>
        </div>

        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
           <button 
             onClick={() => setActiveTab('colores')}
             className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'colores' ? 'bg-white dark:bg-slate-900 text-orange-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
           >
             Colores y Sistema
           </button>
           <button 
             onClick={() => setActiveTab('nomenclador')}
             className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'nomenclador' ? 'bg-white dark:bg-slate-900 text-orange-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
           >
             Nomenclador Nacional
           </button>
        </div>
      </header>

      {activeTab === 'colores' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <PremiumCard className="p-8 space-y-8">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 rounded-2xl">
                  <Palette size={24} />
               </div>
               <div>
                  <h3 className="text-xl font-black uppercase tracking-tight">Sistema de Numeración</h3>
                  <p className="text-sm text-slate-500">Seleccione el estándar de identificación dental.</p>
               </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {['FDI', 'Universal', 'Palmer'].map(sys => (
                <button
                  key={sys}
                  onClick={() => handleUpdateConfig({ sistemaDental: sys })}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${config?.sistemaDental === sys ? 'border-orange-500 bg-orange-50/30' : 'border-slate-100 dark:border-slate-800 hover:border-slate-300'}`}
                >
                  <span className="text-xs font-black uppercase tracking-widest">{sys}</span>
                  <div className={`h-2 w-2 rounded-full ${config?.sistemaDental === sys ? 'bg-orange-500' : 'bg-slate-200'}`} />
                </button>
              ))}
            </div>
          </PremiumCard>

          <PremiumCard className="p-8 space-y-8">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 rounded-2xl">
                  <Activity size={24} />
               </div>
               <div>
                  <h3 className="text-xl font-black uppercase tracking-tight">Estados y Colores</h3>
                  <p className="text-sm text-slate-500">Defina la visualización en el odontograma.</p>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {config?.coloresEstados && Object.entries(config.coloresEstados).map(([key, value]: any) => (
                <div key={key} className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">{key}</label>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                    <input 
                      type="color" 
                      value={value} 
                      onChange={(e) => {
                        const newColores = { ...config.coloresEstados, [key]: e.target.value };
                        handleUpdateConfig({ coloresEstados: newColores });
                      }}
                      className="h-8 w-8 rounded-lg overflow-hidden border-0 cursor-pointer bg-transparent"
                    />
                    <span className="text-sm font-bold uppercase tracking-widest text-slate-600 dark:text-slate-300">{value}</span>
                  </div>
                </div>
              ))}
            </div>
          </PremiumCard>
        </div>
      )}

      {activeTab === 'nomenclador' && (
        <PremiumCard className="p-0 overflow-hidden">
           <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="relative w-full md:w-96">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="BUSCAR PRESTACIÓN..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-0 focus:ring-2 focus:ring-orange-500/20 text-xs font-bold uppercase"
                />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500"
                  >
                    ×
                  </button>
                )}
              </div>
              <button className="flex items-center gap-3 px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl shadow-xl shadow-orange-500/20 transition-all active:scale-95 text-xs font-black uppercase tracking-widest">
                <Plus size={18} />
                Nueva Prestación
              </button>
           </div>

           <div className="overflow-x-auto">
              {filteredPrestaciones.length > 0 ? (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 dark:bg-slate-800/10">
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Código</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Tratamiento</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Honorarios</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredPrestaciones.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/5 transition-colors">
                      <td className="px-8 py-6">
                        <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-black">{p.codigo}</span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="font-bold text-slate-700 dark:text-slate-200 uppercase tracking-tight">{p.nombre}</div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-widest">{p.descripcion || 'Sin descripción'}</div>
                      </td>
                      <td className="px-8 py-6 text-right font-black text-slate-900 dark:text-white">
                        $ {Number(p.honorarios).toLocaleString()}
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center justify-center gap-2">
                           <button className="p-2 hover:bg-blue-50 dark:hover:bg-blue-500/10 text-blue-500 rounded-xl transition-colors">
                              <Edit size={16} />
                           </button>
                           <button className="p-2 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-rose-500 rounded-xl transition-colors">
                              <Trash2 size={16} />
                           </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-20 text-center text-slate-400">
                  <Search size={48} className="mx-auto mb-4 opacity-20" />
                  <p className="font-bold uppercase tracking-widest text-[10px]">No se encontraron prestaciones</p>
                  <p className="text-xs mt-2">Intenta con otro código o nombre de tratamiento.</p>
                </div>
              )}
           </div>
        </PremiumCard>
      )}
    </div>
  );
};
