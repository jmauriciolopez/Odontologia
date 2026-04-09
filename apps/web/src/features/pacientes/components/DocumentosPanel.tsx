import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Image as ImageIcon,
  Upload,
  Trash2,
  Eye,
  Download,
  FolderOpen,
  Search,
  Plus,
  Loader2,
  FileIcon,
  X
} from 'lucide-react';
import { useArchivos, useArchivosMutations } from '../hooks/use-archivos';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface DocumentosPanelProps {
  pacienteId: string;
}

export const DocumentosPanel: React.FC<DocumentosPanelProps> = ({ pacienteId }) => {
  const [filter, setFilter] = useState<'todos' | 'documentos' | 'radiografias'>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const { data, isLoading } = useArchivos(pacienteId);
  const { uploadDocumento, uploadRadiografia, deleteDocumento } = useArchivosMutations(pacienteId);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'doc' | 'rad') => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === 'doc') uploadDocumento.mutate(file);
      else uploadRadiografia.mutate({ file, tipo: 'Panorámica' }); // Default type for now
    }
  };

  const allFiles = [
    ...(data?.documentos || []).map(f => ({ ...f, type: 'documento' as const })),
    ...(data?.radiografias || []).map(f => ({ ...f, type: 'radiografia' as const }))
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const filteredFiles = allFiles.filter(f => {
    const matchesFilter = filter === 'todos' || (filter === 'documentos' && f.type === 'documento') || (filter === 'radiografias' && f.type === 'radiografia');
    const matchesSearch = f.nombreArchivo.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    docs: data?.documentos?.length || 0,
    rads: data?.radiografias?.length || 0,
    total: (data?.documentos?.length || 0) + (data?.radiografias?.length || 0)
  };

  if (isLoading) return (
    <div className="flex h-64 flex-col items-center justify-center gap-4 text-[var(--sb-text-muted)]">
      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      <p className="text-[10px] font-bold uppercase tracking-widest italic">Abriendo Bóveda de Documentos...</p>
    </div>
  );

  return (
    <div className="flex flex-col gap-8">
      {/* 1. Vault Stats & Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <PremiumStatCard
           title="Archivos Totales"
           value={stats.total}
           icon={<FolderOpen size={20} />}
           color="blue"
        />
        <PremiumStatCard
           title="Documentos"
           value={stats.docs}
           icon={<FileText size={20} />}
           color="slate"
        />
        <PremiumStatCard
           title="Radiografías"
           value={stats.rads}
           icon={<ImageIcon size={20} />}
           color="amber"
        />

        <div className="flex flex-col gap-2">
            <label className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-2xl font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95 cursor-pointer text-xs">
                <Upload size={16} />
                Subir Documento
                <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'doc')} />
            </label>
            <label
              className="flex items-center justify-center gap-2 text-white p-3 rounded-2xl font-bold shadow-lg transition-all active:scale-95 cursor-pointer text-xs"
              style={{ background: 'var(--sb-text)', color: 'var(--card-bg)' }}
            >
                <Plus size={16} />
                Subir Radiografía
                <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'rad')} />
            </label>
        </div>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2 rounded-[2rem] border border-[var(--sb-border)] shadow-sm"
        style={{ background: 'var(--card-bg)' }}>
        <div className="flex p-1 rounded-2xl w-full sm:w-auto" style={{ background: 'var(--sb-active-bg)' }}>
          {(['todos', 'documentos', 'radiografias'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className="px-6 py-2 rounded-xl text-xs font-bold capitalize transition-all"
              style={filter === t
                ? { background: 'var(--card-bg)', color: 'var(--brand-500, #6d7bff)', boxShadow: '0 1px 3px rgba(0,0,0,.1)' }
                : { color: 'var(--sb-text-muted)' }
              }
            >
              {t}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2" size={16} style={{ color: 'var(--sb-text-muted)' }} />
          <input
            type="text"
            placeholder="Buscar por nombre..."
            className="input-premium pl-12 pr-4 py-2.5 text-xs font-semibold"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* 3. File Grid */}
      {filteredFiles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredFiles.map((file) => (
              <motion.div
                layout
                key={file.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative medical-card p-4 flex flex-col gap-4 transition-all hover:shadow-xl hover:shadow-blue-500/5 border-[var(--sb-border)]"
              >
                <div className="aspect-[4/3] rounded-2xl flex items-center justify-center relative overflow-hidden transition-all"
                  style={{ background: 'var(--sb-active-bg)' }}>
                    {file.type === 'radiografia' ? (
                       <div className="relative w-full h-full">
                          <img src={file.url} alt={file.nombreArchivo} className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-500" />
                          <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/0 transition-all" />
                       </div>
                    ) : (
                       <FileIcon size={48} className="text-slate-200 group-hover:text-blue-200 transition-all" />
                    )}

                    {/* Hover Actions Overlay */}
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm flex items-center justify-center gap-3">
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="h-10 w-10 bg-white text-[var(--sb-text)] rounded-full flex items-center justify-center hover:scale-110 transition-all shadow-lg shadow-black/20"
                          title="Ver archivo"
                        >
                           <Eye size={18} />
                        </a>
                        <a href={file.url} download className="h-10 w-10 bg-white text-[var(--sb-text)] rounded-full flex items-center justify-center hover:scale-110 transition-all shadow-lg shadow-black/20">
                           <Download size={18} />
                        </a>
                        <button
                          onClick={() => deleteDocumento.mutate(file.id)}
                          className="h-10 w-10 bg-rose-500 text-white rounded-full flex items-center justify-center hover:scale-110 transition-all shadow-lg shadow-rose-500/20"
                        >
                           <Trash2 size={18} />
                        </button>
                    </div>
                </div>

                <div className="space-y-1">
                    <h4 className="font-bold text-xs text-[var(--sb-text)] truncate pr-4" title={file.nombreArchivo}>
                        {file.nombreArchivo}
                    </h4>
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[var(--sb-text-muted)] uppercase tracking-widest">
                            {format(new Date(file.createdAt), 'dd MMM yyyy', { locale: es })}
                        </span>
                        <span className={cn(
                            "text-[9px] font-black uppercase px-2 py-0.5 rounded-full border",
                            file.type === 'radiografia' ? "border-amber-100 text-amber-500 bg-amber-50" : "border-slate-100 text-[var(--sb-text-muted)] bg-[var(--sb-active-bg)]"
                        )}>
                            {file.type}
                        </span>
                    </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 px-6 text-center gap-4 rounded-[4rem] border-2 border-dashed border-[var(--sb-border)]">
             <div className="h-20 w-20 rounded-3xl flex items-center justify-center text-3xl shadow-sm border border-[var(--sb-border)] rotate-12"
               style={{ background: 'var(--card-bg)' }}>📁</div>
             <div className="space-y-1">
               <p className="font-bold text-lg tracking-tight" style={{ color: 'var(--sb-text)' }}>Su Bóveda está Vacía</p>
               <p className="text-xs max-w-[280px] font-medium leading-relaxed" style={{ color: 'var(--sb-text-muted)' }}>
                 Cargue radiografías, estudios o documentos legales para mantener el expediente completo.
               </p>
             </div>
        </div>
      )}
    </div>
  );
};

const PremiumStatCard = ({ title, value, icon, color }: { title: string, value: number, icon: React.ReactNode, color: 'blue' | 'slate' | 'amber' }) => {
    const colors = {
        blue: "bg-blue-600 text-white shadow-blue-500/20",
        slate: "border border-[var(--sb-border)]",
        amber: "bg-amber-500 text-white shadow-amber-500/20"
    };

    return (
        <div className={cn("p-6 rounded-[2rem] flex items-center justify-between group transition-all hover:scale-[1.02]", colors[color])}
          style={color === 'slate' ? { background: 'var(--card-bg)', color: 'var(--sb-text)' } : {}}
        >
            <div className="space-y-1">
                <p className={cn("text-[10px] font-black uppercase tracking-widest", color === 'slate' ? "" : "opacity-80")}
                  style={color === 'slate' ? { color: 'var(--sb-text-muted)' } : {}}>
                    {title}
                </p>
                <p className="text-3xl font-black tracking-tighter">
                    {value}
                </p>
            </div>
            <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-12", color === 'slate' ? "" : "bg-white/20 text-white")}
              style={color === 'slate' ? { background: 'var(--sb-active-bg)', color: 'var(--sb-text-muted)' } : {}}>
                {icon}
            </div>
        </div>
    );
};
