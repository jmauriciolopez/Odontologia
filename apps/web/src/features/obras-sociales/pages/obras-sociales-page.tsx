import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Plus, Pencil, Trash2, X, Save, Loader2, DollarSign, Search, ChevronRight, Tag } from 'lucide-react';
import { toast } from 'sonner';
import { useObrasSociales, useObraSocialDetalle, useObrasSocialesMutations } from '../hooks/use-obras-sociales';
import { ObraSocial, ObraSocialPrestacion } from '../types';
import { httpClient } from '../../../lib/Httpclient';
import { cn } from '@/lib/utils';

const inputCls = 'input-premium text-sm';

// ── Modal crear/editar obra social ──────────────────────────
const ObraSocialModal: React.FC<{
  editing: ObraSocial | null;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  loading: boolean;
}> = ({ editing, onClose, onSave, loading }) => {
  const [form, setForm] = useState({
    nombre: editing?.nombre ?? '',
    codigo: editing?.codigo ?? '',
    descripcion: editing?.descripcion ?? '',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        className="relative w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
        style={{ background: 'var(--card-bg)', border: '1px solid var(--sb-border)', color: 'var(--sb-text)' }}>
        <div className="flex items-center justify-between px-7 py-5 border-b border-[var(--sb-border)]">
          <h2 className="font-black text-base uppercase tracking-tight">
            {editing ? 'Editar Obra Social' : 'Nueva Obra Social'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:opacity-70 text-[var(--sb-text-muted)]">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={async e => { e.preventDefault(); await onSave(form); }} className="p-7 space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase tracking-widest text-[var(--sb-text-muted)]">Nombre *</label>
            <input required value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
              placeholder="Ej: OSDE" className={inputCls} />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase tracking-widest text-[var(--sb-text-muted)]">Código</label>
            <input value={form.codigo} onChange={e => setForm(f => ({ ...f, codigo: e.target.value }))}
              placeholder="Ej: OSDE-001" className={inputCls} />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase tracking-widest text-[var(--sb-text-muted)]">Descripción</label>
            <input value={form.descripcion} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))}
              placeholder="Descripción opcional" className={inputCls} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-[var(--sb-border)] text-sm font-bold text-[var(--sb-text-muted)] hover:opacity-80">
              Cancelar
            </button>
            <button type="submit" disabled={loading}
              className="flex-[2] flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-lg shadow-indigo-500/20 disabled:opacity-60">
              {loading ? <><Loader2 size={14} className="animate-spin" /> Guardando...</> : <><Save size={14} /> Guardar</>}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// ── Modal precios por obra social ───────────────────────────
const PreciosModal: React.FC<{
  obraSocial: ObraSocial;
  onClose: () => void;
}> = ({ obraSocial, onClose }) => {
  const { data: detalle, isLoading } = useObraSocialDetalle(obraSocial.id);
  const { upsertPrecios, deletePrecio } = useObrasSocialesMutations();
  const [prestaciones, setPrestaciones] = React.useState<{ id: string; codigo: string; nombre: string; honorarios: number }[]>([]);
  const [precios, setPrecios] = React.useState<Record<string, string>>({});
  const [search, setSearch] = React.useState('');
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    httpClient.get<any[]>('configuracion/prestaciones').then(data => {
      setPrestaciones(data);
    });
  }, []);

  React.useEffect(() => {
    if (detalle?.prestaciones) {
      const map: Record<string, string> = {};
      detalle.prestaciones.forEach((osp: ObraSocialPrestacion) => {
        map[osp.prestacionId] = String(osp.precio);
      });
      setPrecios(map);
    }
  }, [detalle]);

  const filtered = prestaciones.filter(p =>
    !search || p.nombre.toLowerCase().includes(search.toLowerCase()) || p.codigo.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async () => {
    setSaving(true);
    try {
      const items = Object.entries(precios)
        .filter(([, v]) => v !== '' && Number(v) >= 0)
        .map(([prestacionId, precio]) => ({ prestacionId, precio: Number(precio) }));
      await upsertPrecios.mutateAsync({ id: obraSocial.id, data: { precios: items } });
      toast.success('Precios actualizados');
      onClose();
    } catch (e: any) {
      toast.error(e.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-3xl shadow-2xl overflow-hidden"
        style={{ background: 'var(--card-bg)', border: '1px solid var(--sb-border)', color: 'var(--sb-text)' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-[var(--sb-border)] shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600">
              <DollarSign size={18} />
            </div>
            <div>
              <h2 className="font-black text-base uppercase tracking-tight">Precios — {obraSocial.nombre}</h2>
              <p className="text-[11px] text-[var(--sb-text-muted)] font-medium">Precio por prestación para esta obra social</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:opacity-70 text-[var(--sb-text-muted)]">
            <X size={18} />
          </button>
        </div>

        {/* Search */}
        <div className="px-7 py-4 border-b border-[var(--sb-border)] shrink-0">
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--sb-text-muted)]" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Buscar prestación..." className={cn(inputCls, 'pl-10 py-2')} />
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 size={24} className="animate-spin text-indigo-500" />
            </div>
          ) : (
            <table className="w-full text-left">
              <thead className="sticky top-0" style={{ background: 'var(--card-bg)' }}>
                <tr style={{ borderBottom: '1px solid var(--sb-border)' }}>
                  <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-[var(--sb-text-muted)]">Código</th>
                  <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-[var(--sb-text-muted)]">Prestación</th>
                  <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-[var(--sb-text-muted)] text-right">Base</th>
                  <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-[var(--sb-text-muted)] text-right w-36">Precio OS</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--sb-border)' }}>
                {filtered.map(p => (
                  <tr key={p.id} className="transition-colors hover:bg-[var(--sb-active-bg)]/40">
                    <td className="px-6 py-3">
                      <span className="px-2 py-0.5 rounded text-[11px] font-black"
                        style={{ background: 'var(--sb-active-bg)', color: 'var(--sb-text)' }}>
                        {p.codigo}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm font-medium text-[var(--sb-text)]">{p.nombre}</td>
                    <td className="px-6 py-3 text-right text-sm text-[var(--sb-text-muted)]">
                      ${Number(p.honorarios).toLocaleString()}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--sb-text-muted)] text-sm">$</span>
                        <input
                          type="number"
                          min="0"
                          placeholder={String(p.honorarios)}
                          value={precios[p.id] ?? ''}
                          onChange={e => setPrecios(prev => ({ ...prev, [p.id]: e.target.value }))}
                          className="w-28 pl-6 pr-3 py-1.5 rounded-lg text-sm text-right font-bold outline-none transition-all"
                          style={{
                            background: precios[p.id] ? 'var(--sb-active-bg)' : 'transparent',
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
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 px-7 py-5 border-t border-[var(--sb-border)] shrink-0">
          <p className="text-[11px] text-[var(--sb-text-muted)]">
            Dejá vacío para usar el precio base del nomenclador
          </p>
          <div className="flex gap-3">
            <button onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-[var(--sb-border)] text-sm font-bold text-[var(--sb-text-muted)] hover:opacity-80">
              Cancelar
            </button>
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-lg shadow-indigo-500/20 disabled:opacity-60">
              {saving ? <><Loader2 size={14} className="animate-spin" /> Guardando...</> : <><Save size={14} /> Guardar Precios</>}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// ── Página principal ────────────────────────────────────────
export const ObrasSocialesPage: React.FC = () => {
  const { data: obrasSociales = [], isLoading } = useObrasSociales();
  const { create, update, remove } = useObrasSocialesMutations();

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<ObraSocial | null>(null);
  const [preciosFor, setPreciosFor] = useState<ObraSocial | null>(null);
  const [search, setSearch] = useState('');

  const filtered = obrasSociales.filter(os =>
    !search || os.nombre.toLowerCase().includes(search.toLowerCase()) ||
    (os.codigo?.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSave = async (data: any) => {
    try {
      if (editing) {
        await update.mutateAsync({ id: editing.id, data });
        toast.success('Obra social actualizada');
      } else {
        await create.mutateAsync(data);
        toast.success('Obra social creada');
      }
      setShowModal(false);
      setEditing(null);
    } catch (e: any) {
      toast.error(e.message || 'Error al guardar');
    }
  };

  const handleDelete = (os: ObraSocial) => {
    toast(`¿Eliminar "${os.nombre}"?`, {
      action: {
        label: 'Eliminar',
        onClick: async () => {
          try {
            await remove.mutateAsync(os.id);
            toast.success('Obra social eliminada');
          } catch (e: any) {
            toast.error(e.message || 'Error al eliminar');
          }
        },
      },
      cancel: { label: 'Cancelar', onClick: () => {} },
    });
  };

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-500/20">
              <Building2 size={20} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--sb-text-muted)]">Configuración</span>
          </div>
          <h1 className="text-3xl font-black text-[var(--sb-text)] tracking-tight">Obras Sociales</h1>
          <p className="text-sm text-[var(--sb-text-muted)] mt-1">Gestioná las obras sociales y sus precios por prestación.</p>
        </div>
        <button
          onClick={() => { setEditing(null); setShowModal(true); }}
          className="flex items-center gap-2 btn-primary px-5 py-2.5 rounded-xl"
        >
          <Plus size={18} /> Nueva Obra Social
        </button>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: obrasSociales.length, color: 'text-indigo-600' },
          { label: 'Activas', value: obrasSociales.filter(o => o.activo).length, color: 'text-emerald-600' },
          { label: 'Inactivas', value: obrasSociales.filter(o => !o.activo).length, color: 'text-slate-400' },
          { label: 'Con Precios', value: obrasSociales.filter(o => (o.prestaciones?.length ?? 0) > 0).length, color: 'text-amber-600' },
        ].map(s => (
          <div key={s.label} className="medical-card p-4 flex flex-col gap-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--sb-text-muted)]">{s.label}</span>
            <span className={cn('text-2xl font-black', s.color)}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className="medical-card p-0 overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-[var(--sb-border)]"
          style={{ background: 'var(--sb-active-bg)' }}>
          <div className="relative w-full max-w-sm">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--sb-text-muted)]" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Buscar obra social..." className={cn(inputCls, 'pl-10 py-2')} />
          </div>
          <span className="text-[11px] font-bold text-[var(--sb-text-muted)] whitespace-nowrap">
            {filtered.length} registros
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={28} className="animate-spin text-indigo-500" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-[var(--sb-text-muted)]">
              <Building2 size={40} className="opacity-20" />
              <p className="text-[11px] font-black uppercase tracking-widest">
                {search ? 'Sin resultados' : 'No hay obras sociales registradas'}
              </p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr style={{ background: 'var(--sb-active-bg)', borderBottom: '1px solid var(--sb-border)' }}>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--sb-text-muted)]">Nombre</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--sb-text-muted)]">Código</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--sb-text-muted)]">Estado</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--sb-text-muted)]">Prestaciones</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--sb-text-muted)] text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--sb-border)' }}>
                {filtered.map(os => (
                  <tr key={os.id} className="group transition-colors hover:bg-[var(--sb-active-bg)]/40">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-indigo-100 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 font-black text-sm">
                          {os.nombre.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-[var(--sb-text)]">{os.nombre}</div>
                          {os.descripcion && <div className="text-[11px] text-[var(--sb-text-muted)]">{os.descripcion}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {os.codigo ? (
                        <span className="px-2 py-0.5 rounded text-[11px] font-black"
                          style={{ background: 'var(--sb-active-bg)', color: 'var(--sb-text)' }}>
                          {os.codigo}
                        </span>
                      ) : <span className="text-[var(--sb-text-muted)] text-xs">—</span>}
                    </td>
                    <td className="px-6 py-4">
                      {os.activo ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Activa
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black bg-slate-100 dark:bg-slate-800 text-[var(--sb-text-muted)]">
                          Inactiva
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setPreciosFor(os)}
                        className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-600 hover:text-indigo-500 transition-colors"
                      >
                        <Tag size={13} />
                        {(os.prestaciones?.length ?? 0) > 0
                          ? `${os.prestaciones!.length} precios`
                          : 'Configurar precios'}
                        <ChevronRight size={12} />
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => { setEditing(os); setShowModal(true); }}
                          className="p-2 rounded-lg text-[var(--sb-text-muted)] hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all"
                          title="Editar"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(os)}
                          className="p-2 rounded-lg text-[var(--sb-text-muted)] hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all"
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
          )}
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showModal && (
          <ObraSocialModal
            editing={editing}
            onClose={() => { setShowModal(false); setEditing(null); }}
            onSave={handleSave}
            loading={create.isPending || update.isPending}
          />
        )}
        {preciosFor && (
          <PreciosModal
            obraSocial={preciosFor}
            onClose={() => setPreciosFor(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
