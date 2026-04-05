import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Palette, Activity, Plus, Trash2, Edit, Search, X, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';
import { PremiumCard } from '../../../components/ui/premium-card';
import { httpClient } from '../../../lib/Httpclient';
import { cn } from '@/lib/utils';

interface Prestacion {
  id: string;
  codigo: string;
  nombre: string;
  descripcion?: string;
  honorarios: number;
  activo: boolean;
}

const emptyPrestacion = { codigo: '', nombre: '', descripcion: '', honorarios: 0 };

export const NomenclaturaPage: React.FC = () => {
  const [config, setConfig]             = useState<any>(null);
  const [prestaciones, setPrestaciones] = useState<Prestacion[]>([]);
  const [isLoading, setIsLoading]       = useState(true);
  const [activeTab, setActiveTab]       = useState<'colores' | 'nomenclador'>('colores');
  const [searchTerm, setSearchTerm]     = useState('');

  // Prestacion modal state
  const [showModal, setShowModal]       = useState(false);
  const [editingId, setEditingId]       = useState<string | null>(null);
  const [formData, setFormData]         = useState(emptyPrestacion);
  const [isSaving, setIsSaving]         = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [configRes, prestacionesRes] = await Promise.all([
        httpClient.get<any>('configuracion'),
        httpClient.get<Prestacion[]>('configuracion/prestaciones'),
      ]);
      setConfig(configRes);
      setPrestaciones(prestacionesRes);
    } catch {
      toast.error('Error al cargar la configuración');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateConfig = async (newData: any) => {
    try {
      const res = await httpClient.patch<any>('configuracion', newData);
      setConfig(res);
      toast.success('Configuración actualizada');
    } catch (err: any) {
      toast.error(err.message || 'Error al guardar');
    }
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData(emptyPrestacion);
    setShowModal(true);
  };

  const handleOpenEdit = (p: Prestacion) => {
    setEditingId(p.id);
    setFormData({ codigo: p.codigo, nombre: p.nombre, descripcion: p.descripcion || '', honorarios: p.honorarios });
    setShowModal(true);
  };

  const handleDelete = (p: Prestacion) => {
    toast(`¿Eliminar "${p.nombre}"?`, {
      action: {
        label: 'Eliminar',
        onClick: async () => {
          try {
            await httpClient.delete(`configuracion/prestaciones/${p.id}`);
            setPrestaciones(prev => prev.filter(x => x.id !== p.id));
            toast.success('Prestación eliminada');
          } catch (err: any) {
            toast.error(err.message || 'Error al eliminar');
          }
        },
      },
      cancel: { label: 'Cancelar', onClick: () => {} },
    });
  };

  const handleSavePrestacion = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingId) {
        const res = await httpClient.patch<Prestacion>(`configuracion/prestaciones/${editingId}`, formData);
        setPrestaciones(prev => prev.map(p => p.id === editingId ? res : p));
        toast.success('Prestación actualizada');
      } else {
        const res = await httpClient.post<Prestacion>('configuracion/prestaciones', formData);
        setPrestaciones(prev => [...prev, res]);
        toast.success('Prestación creada');
      }
      setShowModal(false);
    } catch (err: any) {
      toast.error(err.message || 'Error al guardar');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredPrestaciones = prestaciones.filter(p => {
    if (!searchTerm.trim()) return true;
    const t = searchTerm.toLowerCase();
    return p.nombre.toLowerCase().includes(t) || p.codigo.toLowerCase().includes(t) || (p.descripcion?.toLowerCase().includes(t));
  });

  const inputCls = 'w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/10 transition-all';

  if (isLoading) return (
    <div className="flex h-64 items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
    </div>
  );

  return (
    <div className="flex flex-col gap-10 pb-20">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-500 text-white rounded-xl shadow-lg shadow-orange-500/20">
              <Database size={20} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Administración Clínica</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
            Nomenclatura y Configuración
          </h1>
        </div>

        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
          {(['colores', 'nomenclador'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all',
                activeTab === tab ? 'bg-white dark:bg-slate-900 text-orange-600 shadow-md' : 'text-slate-500 hover:text-slate-700'
              )}
            >
              {tab === 'colores' ? 'Colores y Sistema' : 'Nomenclador Nacional'}
            </button>
          ))}
        </div>
      </header>

      {/* Tab: Colores */}
      {activeTab === 'colores' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <PremiumCard className="p-8 space-y-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 rounded-2xl">
                <Palette size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black uppercase tracking-tight">Sistema de Numeración</h3>
                <p className="text-sm text-slate-500">Estándar de identificación dental.</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {['FDI', 'Universal', 'Palmer'].map(sys => (
                <button
                  key={sys}
                  onClick={() => handleUpdateConfig({ sistemaDental: sys })}
                  className={cn(
                    'p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2',
                    config?.sistemaDental === sys
                      ? 'border-orange-500 bg-orange-50/30 dark:bg-orange-500/10'
                      : 'border-slate-100 dark:border-slate-800 hover:border-slate-300'
                  )}
                >
                  <span className="text-xs font-black uppercase tracking-widest">{sys}</span>
                  <div className={cn('h-2 w-2 rounded-full', config?.sistemaDental === sys ? 'bg-orange-500' : 'bg-slate-200')} />
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
                <p className="text-sm text-slate-500">Visualización en el odontograma.</p>
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

      {/* Tab: Nomenclador */}
      {activeTab === 'nomenclador' && (
        <PremiumCard className="p-0 overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="relative w-full md:w-96">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar prestación..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X size={14} />
                </button>
              )}
            </div>
            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-2 px-6 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-orange-500/20 transition-all active:scale-95"
            >
              <Plus size={16} /> Nueva Prestación
            </button>
          </div>

          <div className="overflow-x-auto">
            {filteredPrestaciones.length > 0 ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-800/10 border-b border-slate-100 dark:border-slate-800">
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Código</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Tratamiento</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Honorarios</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredPrestaciones.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors">
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-black">{p.codigo}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-sm text-slate-800 dark:text-slate-200">{p.nombre}</div>
                        {p.descripcion && <div className="text-[11px] text-slate-400 mt-0.5">{p.descripcion}</div>}
                      </td>
                      <td className="px-6 py-4 text-right font-black text-slate-900 dark:text-white">
                        ${Number(p.honorarios).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="p-2 hover:bg-blue-50 dark:hover:bg-blue-500/10 text-slate-400 hover:text-blue-500 rounded-xl transition-colors"
                            title="Editar"
                          >
                            <Edit size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(p)}
                            className="p-2 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 rounded-xl transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-20 text-center text-slate-400">
                <Search size={40} className="mx-auto mb-4 opacity-20" />
                <p className="font-bold uppercase tracking-widest text-[10px]">
                  {searchTerm ? 'No se encontraron prestaciones' : 'Sin prestaciones registradas'}
                </p>
              </div>
            )}
          </div>
        </PremiumCard>
      )}

      {/* Modal crear/editar prestación */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 dark:border-slate-800">
                <h2 className="text-lg font-black uppercase tracking-tight text-slate-900 dark:text-white">
                  {editingId ? 'Editar Prestación' : 'Nueva Prestación'}
                </h2>
                <button onClick={() => setShowModal(false)} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSavePrestacion} className="p-8 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Código *</label>
                    <input
                      required
                      value={formData.codigo}
                      onChange={e => setFormData(f => ({ ...f, codigo: e.target.value }))}
                      placeholder="01.01"
                      className={inputCls}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Honorarios</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.honorarios}
                      onChange={e => setFormData(f => ({ ...f, honorarios: Number(e.target.value) }))}
                      className={inputCls}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Nombre *</label>
                  <input
                    required
                    value={formData.nombre}
                    onChange={e => setFormData(f => ({ ...f, nombre: e.target.value }))}
                    placeholder="Ej: Consulta inicial"
                    className={inputCls}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Descripción</label>
                  <input
                    value={formData.descripcion}
                    onChange={e => setFormData(f => ({ ...f, descripcion: e.target.value }))}
                    placeholder="Descripción opcional"
                    className={inputCls}
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)}
                    className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    Cancelar
                  </button>
                  <button type="submit" disabled={isSaving}
                    className="flex-[2] flex items-center justify-center gap-2 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-sm font-bold shadow-lg shadow-orange-500/20 transition-colors disabled:opacity-60">
                    {isSaving ? <><Loader2 size={15} className="animate-spin" /> Guardando...</> : <><Save size={15} /> {editingId ? 'Guardar Cambios' : 'Crear Prestación'}</>}
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
