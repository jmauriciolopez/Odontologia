import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Palette, Activity, Plus, Trash2, Edit, Search, X, Loader2, Save, Building2, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import { PremiumCard } from '../../../components/ui/premium-card';
import { httpClient } from '../../../lib/Httpclient';
import { cn } from '@/lib/utils';
import { useObrasSociales } from '../../obras-sociales/hooks/use-obras-sociales';
import { useObraSocialDetalle, useObrasSocialesMutations } from '../../obras-sociales/hooks/use-obras-sociales';
import { ObraSocialPrestacion } from '../../obras-sociales/types';

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
  const [activeTab, setActiveTab]       = useState<'colores' | 'nomenclador' | 'obras-sociales'>('colores');
  const [searchTerm, setSearchTerm]     = useState('');

  // Obras sociales state
  const { data: obrasSociales = [] } = useObrasSociales();
  const [selectedOS, setSelectedOS]   = useState<string | null>(null);
  const { data: osDetalle }           = useObraSocialDetalle(selectedOS);
  const { upsertPrecios }             = useObrasSocialesMutations();
  const [osPrecios, setOsPrecios]     = useState<Record<string, string>>({});
  const [savingPrecios, setSavingPrecios] = useState(false);
  const [osSearch, setOsSearch]       = useState('');

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

  // Sync OS precios when detalle loads
  useEffect(() => {
    if (osDetalle?.prestaciones) {
      const map: Record<string, string> = {};
      osDetalle.prestaciones.forEach((osp: ObraSocialPrestacion) => {
        map[osp.prestacionId] = String(osp.precio);
      });
      setOsPrecios(map);
    } else {
      setOsPrecios({});
    }
  }, [osDetalle]);

  const handleSaveOsPrecios = async () => {
    if (!selectedOS) return;
    setSavingPrecios(true);
    try {
      const items = Object.entries(osPrecios)
        .filter(([, v]) => v !== '' && Number(v) >= 0)
        .map(([prestacionId, precio]) => ({ prestacionId, precio: Number(precio) }));
      await upsertPrecios.mutateAsync({ id: selectedOS, data: { precios: items } });
      toast.success('Precios actualizados');
    } catch (e: any) {
      toast.error(e.message || 'Error al guardar');
    } finally {
      setSavingPrecios(false);
    }
  };

  const filteredOsPrestaciones = prestaciones.filter(p =>
    !osSearch || p.nombre.toLowerCase().includes(osSearch.toLowerCase()) || p.codigo.toLowerCase().includes(osSearch.toLowerCase())
  );

  const inputCls = 'input-premium text-sm font-medium';

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
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--sb-text-muted)]">Administración Clínica</span>
          </div>
          <h1 className="text-4xl font-black text-[var(--sb-text)] tracking-tight uppercase">
            Nomenclatura y Configuración
          </h1>
        </div>

        <div className="flex p-1 rounded-2xl border" style={{ borderColor: 'var(--sb-border)' }}>
          {(['colores', 'nomenclador', 'obras-sociales'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all',
                activeTab === tab
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                  : 'text-[var(--sb-text-muted)] hover:text-[var(--sb-text)]'
              )}
            >
              {tab === 'colores' ? 'Colores' : tab === 'nomenclador' ? 'Nomenclador' : 'Obras Sociales'}
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
                <p className="text-sm text-[var(--sb-text-muted)]">Estándar de identificación dental.</p>
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
                      : 'border-[var(--sb-border)] hover:border-slate-300'
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
                <p className="text-sm text-[var(--sb-text-muted)]">Visualización en el odontograma.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {config?.coloresEstados && Object.entries(config.coloresEstados).map(([key, value]: any) => (
                <div key={key} className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[var(--sb-text-muted)] px-1">{key}</label>
                  <div className="flex items-center gap-3 p-3 rounded-2xl border"
                    style={{ background: 'var(--sb-active-bg)', borderColor: 'var(--sb-border)' }}>
                    <input
                      type="color"
                      value={value}
                      onChange={(e) => {
                        const newColores = { ...config.coloresEstados, [key]: e.target.value };
                        handleUpdateConfig({ coloresEstados: newColores });
                      }}
                      className="h-8 w-8 rounded-lg overflow-hidden border-0 cursor-pointer bg-transparent"
                    />
                    <span className="text-sm font-bold uppercase tracking-widest text-[var(--sb-text-muted)]">{value}</span>
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
          <div className="p-6 border-b border-[var(--sb-border)] flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="relative w-full md:w-96">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--sb-text-muted)]" />
              <input
                type="text"
                placeholder="Buscar prestación..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-premium pl-10 pr-10 py-2.5 text-sm font-medium"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--sb-text-muted)] hover:text-slate-600">
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
                  <tr className="text-left" style={{ background: 'var(--sb-active-bg)', borderBottom: '1px solid var(--sb-border)' }}>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--sb-text-muted)]">Código</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--sb-text-muted)]">Tratamiento</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--sb-text-muted)] text-right">Honorarios</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--sb-text-muted)] text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: 'var(--sb-border)' }}>
                  {filteredPrestaciones.map(p => (
                    <tr key={p.id} className="transition-colors">
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-black"
                          style={{ background: 'var(--sb-active-bg)', color: 'var(--sb-text)' }}>{p.codigo}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-sm text-[var(--sb-text)]">{p.nombre}</div>
                        {p.descripcion && <div className="text-[11px] text-[var(--sb-text-muted)] mt-0.5">{p.descripcion}</div>}
                      </td>
                      <td className="px-6 py-4 text-right font-black text-[var(--sb-text)]">
                        ${Number(p.honorarios).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="p-2 hover:bg-blue-50 dark:hover:bg-blue-500/10 text-[var(--sb-text-muted)] hover:text-blue-500 rounded-xl transition-colors"
                            title="Editar"
                          >
                            <Edit size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(p)}
                            className="p-2 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-[var(--sb-text-muted)] hover:text-rose-500 rounded-xl transition-colors"
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
              <div className="p-20 text-center text-[var(--sb-text-muted)]">
                <Search size={40} className="mx-auto mb-4 opacity-20" />
                <p className="font-bold uppercase tracking-widest text-[10px]">
                  {searchTerm ? 'No se encontraron prestaciones' : 'Sin prestaciones registradas'}
                </p>
              </div>
            )}
          </div>
        </PremiumCard>
      )}

      {/* Tab: Obras Sociales — precios por OS */}
      {activeTab === 'obras-sociales' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* OS list */}
          <div className="medical-card p-0 overflow-hidden">
            <div className="px-5 py-4 border-b border-[var(--sb-border)]" style={{ background: 'var(--sb-active-bg)' }}>
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--sb-text-muted)]">Obras Sociales</p>
            </div>
            <div className="divide-y" style={{ borderColor: 'var(--sb-border)' }}>
              {obrasSociales.filter(o => o.activo).map(os => (
                <button
                  key={os.id}
                  onClick={() => setSelectedOS(os.id)}
                  className={cn(
                    'w-full flex items-center justify-between px-5 py-3.5 text-left transition-all',
                    selectedOS === os.id
                      ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-600'
                      : 'text-[var(--sb-text)] hover:bg-[var(--sb-active-bg)]'
                  )}
                >
                  <div>
                    <div className="text-sm font-bold">{os.nombre}</div>
                    {os.codigo && <div className="text-[11px] text-[var(--sb-text-muted)]">{os.codigo}</div>}
                  </div>
                  {selectedOS === os.id && <div className="h-2 w-2 rounded-full bg-orange-500" />}
                </button>
              ))}
              {obrasSociales.filter(o => o.activo).length === 0 && (
                <div className="px-5 py-8 text-center text-[11px] text-[var(--sb-text-muted)] font-bold uppercase tracking-widest">
                  Sin obras sociales activas
                </div>
              )}
            </div>
          </div>

          {/* Precios table */}
          <div className="lg:col-span-2 medical-card p-0 overflow-hidden">
            {!selectedOS ? (
              <div className="flex flex-col items-center justify-center py-24 gap-3 text-[var(--sb-text-muted)]">
                <Building2 size={40} className="opacity-20" />
                <p className="text-[11px] font-black uppercase tracking-widest">Seleccioná una obra social</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--sb-border)]"
                  style={{ background: 'var(--sb-active-bg)' }}>
                  <div className="flex items-center gap-3">
                    <DollarSign size={16} className="text-orange-500" />
                    <span className="text-sm font-black text-[var(--sb-text)]">
                      {obrasSociales.find(o => o.id === selectedOS)?.nombre}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--sb-text-muted)]" />
                      <input value={osSearch} onChange={e => setOsSearch(e.target.value)}
                        placeholder="Buscar..." className="input-premium pl-8 py-1.5 text-xs w-44" />
                    </div>
                    <button onClick={handleSaveOsPrecios} disabled={savingPrecios}
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-black shadow-lg shadow-orange-500/20 disabled:opacity-60 transition-all">
                      {savingPrecios ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                      Guardar
                    </button>
                  </div>
                </div>
                <div className="overflow-auto max-h-[500px]">
                  <table className="w-full text-left">
                    <thead className="sticky top-0" style={{ background: 'var(--card-bg)' }}>
                      <tr style={{ borderBottom: '1px solid var(--sb-border)' }}>
                        <th className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-[var(--sb-text-muted)]">Código</th>
                        <th className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-[var(--sb-text-muted)]">Prestación</th>
                        <th className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-[var(--sb-text-muted)] text-right">Base</th>
                        <th className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-[var(--sb-text-muted)] text-right w-32">Precio OS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y" style={{ borderColor: 'var(--sb-border)' }}>
                      {filteredOsPrestaciones.map(p => (
                        <tr key={p.id} className="hover:bg-[var(--sb-active-bg)]/40 transition-colors">
                          <td className="px-5 py-2.5">
                            <span className="px-2 py-0.5 rounded text-[11px] font-black"
                              style={{ background: 'var(--sb-active-bg)', color: 'var(--sb-text)' }}>
                              {p.codigo}
                            </span>
                          </td>
                          <td className="px-5 py-2.5 text-sm text-[var(--sb-text)]">{p.nombre}</td>
                          <td className="px-5 py-2.5 text-right text-sm text-[var(--sb-text-muted)]">
                            ${Number(p.honorarios).toLocaleString()}
                          </td>
                          <td className="px-5 py-2.5 text-right">
                            <div className="relative inline-flex items-center">
                              <span className="absolute left-2.5 text-[var(--sb-text-muted)] text-sm">$</span>
                              <input
                                type="number" min="0"
                                placeholder={String(p.honorarios)}
                                value={osPrecios[p.id] ?? ''}
                                onChange={e => setOsPrecios(prev => ({ ...prev, [p.id]: e.target.value }))}
                                className="w-28 pl-6 pr-2 py-1.5 rounded-lg text-sm text-right font-bold outline-none transition-all"
                                style={{
                                  background: osPrecios[p.id] ? 'var(--sb-active-bg)' : 'transparent',
                                  border: '1px solid var(--sb-border)',
                                  color: 'var(--sb-text)',
                                }}
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
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
              className="relative w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
              style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', color: 'var(--sb-text)' }}
            >
              <div className="flex items-center justify-between px-8 py-6 border-b border-[var(--sb-border)]">
                <h2 className="text-lg font-black uppercase tracking-tight text-[var(--sb-text)]">
                  {editingId ? 'Editar Prestación' : 'Nueva Prestación'}
                </h2>
                <button onClick={() => setShowModal(false)} className="p-2 rounded-xl text-[var(--sb-text-muted)] transition-colors hover:opacity-80">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSavePrestacion} className="p-8 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black uppercase tracking-widest text-[var(--sb-text-muted)]">Código *</label>
                    <input
                      required
                      value={formData.codigo}
                      onChange={e => setFormData(f => ({ ...f, codigo: e.target.value }))}
                      placeholder="01.01"
                      className={inputCls}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black uppercase tracking-widest text-[var(--sb-text-muted)]">Honorarios</label>
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
                  <label className="text-[11px] font-black uppercase tracking-widest text-[var(--sb-text-muted)]">Nombre *</label>
                  <input
                    required
                    value={formData.nombre}
                    onChange={e => setFormData(f => ({ ...f, nombre: e.target.value }))}
                    placeholder="Ej: Consulta inicial"
                    className={inputCls}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-widest text-[var(--sb-text-muted)]">Descripción</label>
                  <input
                    value={formData.descripcion}
                    onChange={e => setFormData(f => ({ ...f, descripcion: e.target.value }))}
                    placeholder="Descripción opcional"
                    className={inputCls}
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)}
                    className="flex-1 py-3 rounded-xl border border-[var(--sb-border)] text-sm font-bold text-[var(--sb-text-muted)] transition-colors hover:opacity-80">
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
