import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Presupuesto, Pago } from '../../finanzas/types';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Edit3,
  ExternalLink,
  User,
  Phone,
  Contact,
  CalendarDays,
  MoreVertical,
  History,
  TrendingUp,
  CreditCard,
  Calendar,
  Printer,
  Copy,
} from 'lucide-react';

// Hooks
import { usePacienteDetalle, useEvolucionMutations, usePacienteMutations, useAntecedenteMutations } from '../hooks/use-pacientes';
import { useTratamientos } from '../../tratamientos/hooks/use-tratamientos';
import { useTurnos } from '../../agenda/hooks/use-turnos';
import { usePacienteFinanzas } from '../../finanzas/hooks/use-presupuestos';
import { toast } from 'sonner';

// Components
import { PacienteForm } from '../components/paciente-form';
import { AntecedenteModal } from '../components/antecedente-modal';

// Components
import { PacienteTabs } from '../components/PacienteTabs';
import { AntecedentesAlerts } from '../components/AntecedentesAlerts';
import { EvolucionClinicaTimeline } from '../components/EvolucionClinicaTimeline';
import { DocumentosPanel } from '../components/DocumentosPanel';
import { PeriodontogramaManager } from '../components/PeriodontogramaManager';
import { TratamientoProgreso } from '../../tratamientos/components/TratamientoProgreso';
import { NuevoPlanModal } from '../../tratamientos/components/nuevo-plan-modal';
import { FinanzasTabContent } from '../../finanzas/components/FinanzasTabContent';
import { PremiumCard } from '@/components/ui/premium-card';
import { cn } from '@/lib/utils';

// Lazy load Three.js heavy component to avoid blocking initial render
const OdontogramaManager = React.lazy(() =>
  import('../../odontograma/components/OdontogramaManager').then(m => ({ default: m.OdontogramaManager }))
);

export const PacienteDetallePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('resumen');

  const { data: paciente, isLoading, error } = usePacienteDetalle(id!);
  const { createEvolucion } = useEvolucionMutations();
  const { updatePaciente } = usePacienteMutations();
  const { createAntecedente } = useAntecedenteMutations();
  const { planes: planesTratamiento, updateItemEstado, createPlan, isCreating } = useTratamientos(id);
  const { data: turnosData } = useTurnos({ pacienteId: id });
  const turnos = turnosData?.data || [];
  const { data: presupuestosData } = usePacienteFinanzas(id!);
  const presupuestos = Array.isArray(presupuestosData) ? presupuestosData : (presupuestosData as any)?.data || [];
  const [showEditModal, setShowEditModal]           = useState(false);
  const [showAntecedenteModal, setShowAntecedenteModal] = useState(false);
  const [showNuevoPlanModal, setShowNuevoPlanModal] = useState(false);
  const [showMoreMenu, setShowMoreMenu]             = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  // Close more menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
        setShowMoreMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (isLoading) return (
    <div className="flex h-[60vh] flex-col items-center justify-center gap-4 text-[var(--sb-text-muted)]">
      <div className="h-12 w-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
      <p className="text-sm font-bold animate-pulse uppercase tracking-widest">Sincronizando Ficha Clínica...</p>
    </div>
  );

  if (error || !paciente) return (
    <div className="p-10 text-center medical-card border-rose-200 bg-rose-50/50">
      <p className="text-rose-600 font-bold">Error: No se pudo cargar la información del paciente.</p>
      <Link to="/pacientes" className="text-blue-500 hover:underline mt-4 block">Volver a la lista</Link>
    </div>
  );

  const handleAddEvolucion = (descripcion: string, categoria?: string) => {
    if (paciente.ficha?.id) {
      createEvolucion.mutate({ fichaId: paciente.ficha.id, data: { descripcion, categoria } });
    }
  };

  const balance = presupuestos.reduce((acc: number, curr: Presupuesto) => {
    // Presupuestos pendientes no generan deuda aún
    const total = curr.estado === 'pendiente' ? 0 : Number(curr.total || 0);
    const pagado = (curr.pagos || []).reduce((pAcc: number, pCurr: Pago) => pAcc + Number(pCurr.monto), 0);
    return acc + (total - pagado);
  }, 0);

  const totalDeuda = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
  }).format(balance);

  const calculateAge = (birthday: string | null | undefined) => {
    if (!birthday) return '?';
    const d = new Date(birthday);
    if (isNaN(d.getTime())) return '?';
    const ageDifMs = Date.now() - d.getTime();
    return Math.abs(new Date(ageDifMs).getUTCFullYear() - 1970);
  };

  return (
    <div className="flex flex-col gap-6 pb-20 max-w-[1600px] mx-auto">
      {/* 360 Header Premium */}
      <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between bg-[var(--card-bg)] p-8 rounded-[3rem] shadow-medical border border-[var(--sb-border)] relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
           <User size={120} />
        </div>

        <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
          <div className="h-24 w-24 rounded-[2rem] bg-gradient-to-br from-blue-600 to-indigo-700 p-0.5 shadow-xl shadow-blue-500/20">
             <div className="h-full w-full rounded-[2.1rem] bg-[var(--card-bg)] flex items-center justify-center text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-indigo-600">
               {paciente.nombre[0]}{paciente.apellido[0]}
             </div>
          </div>

          <div className="text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
               <h1 className="text-3xl font-black text-[var(--sb-text)] tracking-tight uppercase">
                 {paciente.nombre} {paciente.apellido}
               </h1>
               <div className="px-3 py-1 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest self-center">
                 Paciente Activo
               </div>
            </div>

               <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-bold text-[var(--sb-text-muted)]">
                  <div className="flex items-center gap-1.5"><Contact size={14} /> {paciente.documento}</div>
                  <div className="h-1 w-1 rounded-full bg-[var(--sb-border)]" />
               <div className="flex items-center gap-1.5"><Phone size={14} /> {paciente.telefono}</div>
               <div className="h-1 w-1 rounded-full bg-[var(--sb-border)]" />
               <div className="flex items-center gap-1.5"><CalendarDays size={14} /> {calculateAge(paciente.fechaNacimiento)} Años</div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 relative z-10">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[var(--sb-active-bg)] border border-[var(--sb-border)] text-[var(--sb-text-muted)] text-xs font-bold hover:opacity-80 dark:hover:bg-slate-700 transition-all active:scale-95 shadow-sm"
            onClick={() => setShowEditModal(true)}
          >
            <Edit3 size={16} /> Editar Perfil
          </button>

          <button
            onClick={() => navigate(`/pacientes/${id}/odontograma/${paciente.ficha?.id}`)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-500/25"
          >
            <ExternalLink size={16} /> Odontograma Full
          </button>

          <div className="relative" ref={moreMenuRef}>
            <button
              onClick={() => setShowMoreMenu(v => !v)}
              className="p-2.5 rounded-2xl bg-[var(--sb-active-bg)] text-[var(--sb-text-muted)] hover:text-[var(--sb-text)] transition-colors border border-[var(--sb-border)]"
              title="Más opciones"
            >
              <MoreVertical size={20} />
            </button>
            <AnimatePresence>
              {showMoreMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -4 }}
                  className="absolute right-0 top-full mt-2 w-52 rounded-2xl shadow-xl z-50 overflow-hidden"
                  style={{ background: 'var(--card-bg)', border: '1px solid var(--sb-border)' }}
                >
                  <div className="p-1.5 space-y-0.5">
                    <button
                      onClick={() => { navigate(`/agenda?pacienteId=${id}`); setShowMoreMenu(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-colors hover:bg-[var(--sb-active-bg)]"
                      style={{ color: 'var(--sb-text)' }}
                    >
                      <Calendar size={15} className="text-blue-500" /> Agendar Turno
                    </button>
                    <button
                      onClick={() => { setActiveTab('tratamientos'); setShowNuevoPlanModal(true); setShowMoreMenu(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-colors hover:bg-[var(--sb-active-bg)]"
                      style={{ color: 'var(--sb-text)' }}
                    >
                      <TrendingUp size={15} className="text-emerald-500" /> Nuevo Plan
                    </button>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(paciente.id);
                        toast.success('ID copiado al portapapeles');
                        setShowMoreMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-colors hover:bg-[var(--sb-active-bg)]"
                      style={{ color: 'var(--sb-text)' }}
                    >
                      <Copy size={15} className="text-slate-400" /> Copiar ID
                    </button>
                    <button
                      onClick={() => { window.print(); setShowMoreMenu(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-colors hover:bg-[var(--sb-active-bg)]"
                      style={{ color: 'var(--sb-text)' }}
                    >
                      <Printer size={15} className="text-slate-400" /> Imprimir Ficha
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Productivity Quick Jumps */}
      <div className="flex items-center gap-4 bg-[var(--card-bg)] backdrop-blur-sm p-2 rounded-2xl border border-[var(--sb-border)] self-start ml-4 -mt-2">
         <span className="text-[10px] font-black uppercase tracking-widest text-[var(--sb-text-muted)] px-3 border-r border-[var(--sb-border)]">Accesos Rápidos</span>
          <div className="flex items-center gap-1">
            <button
              disabled={!paciente.ficha}
              onClick={() => navigate(`/pacientes/${id}/odontograma/${paciente.ficha?.id}`)}
              className="px-3 py-1.5 text-[11px] font-bold text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-xl transition-all disabled:opacity-50"
            >
              Odontograma
            </button>
            <button onClick={() => setActiveTab('finanzas')} className="px-3 py-1.5 text-[11px] font-bold text-[var(--sb-text-muted)] hover:opacity-80 rounded-xl transition-all">Pagos & Deudas</button>
            <button onClick={() => setActiveTab('documentos')} className="px-3 py-1.5 text-[11px] font-bold text-[var(--sb-text-muted)] hover:opacity-80 rounded-xl transition-all">Radiografías</button>
            <button onClick={() => setActiveTab('evoluciones')} className="px-3 py-1.5 text-[11px] font-bold text-[var(--sb-text-muted)] hover:opacity-80 rounded-xl transition-all">Historia Clínica</button>
         </div>
      </div>

      {/* Tabs Navigation */}
      <PacienteTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Tab Content Area */}
      <div className="min-h-[500px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'resumen' && (
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
                <div className="space-y-8">
                  {/* Quick Clinical Metrics */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                     <div className="medical-card p-6 border-l-4 border-l-blue-500 bg-white shadow-medical">
                       <p className="text-[10px] font-bold text-[var(--sb-text-muted)] uppercase tracking-widest mb-1">Evoluciones</p>
                       <div className="flex items-center justify-between">
                         <span className="text-2xl font-black text-[var(--sb-text)]">{paciente.ficha?.evoluciones?.length || 0}</span>
                         <div className="p-2 bg-blue-50 rounded-xl text-blue-500"><History size={18}/></div>
                       </div>
                     </div>
                     <div className="medical-card p-6 border-l-4 border-l-emerald-500 bg-white shadow-medical">
                       <p className="text-[10px] font-bold text-[var(--sb-text-muted)] uppercase tracking-widest mb-1">Tratamientos</p>
                       <div className="flex items-center justify-between">
                         <span className="text-2xl font-black text-[var(--sb-text)]">{planesTratamiento.length}</span>
                         <div className="p-2 bg-emerald-50 rounded-xl text-emerald-500"><TrendingUp size={18}/></div>
                       </div>
                     </div>
                      <div className="medical-card p-6 border-l-4 border-l-amber-500 bg-white shadow-medical">
                        <p className="text-[10px] font-bold text-[var(--sb-text-muted)] uppercase tracking-widest mb-1">Deuda Pendiente</p>
                        <div className="flex items-center justify-between">
                          <span className={cn(
                            "text-2xl font-black transition-colors",
                            balance > 0 ? "text-rose-600" : "text-emerald-600"
                          )}>
                            {totalDeuda}
                          </span>
                          <div className={cn(
                            "p-2 rounded-xl text-amber-500",
                            balance > 0 ? "bg-rose-50" : "bg-emerald-50"
                          )}>
                            <CreditCard size={18}/>
                          </div>
                        </div>
                      </div>
                  </div>

                  <AntecedentesAlerts
                    antecedentes={paciente.ficha?.antecedentes}
                    onAdd={() => setShowAntecedenteModal(true)}
                  />

                  {/* Last Note Preview */}
                  {paciente.ficha?.evoluciones?.[0] && (
                    <div className="medical-card p-8 bg-gradient-to-br from-white to-slate-50 border-[var(--sb-border)] shadow-md">
                       <div className="flex items-center gap-2 mb-4">
                          <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                          <h2 className="text-xs font-bold text-[var(--sb-text-muted)] uppercase tracking-widest">Último Registro Clínico</h2>
                       </div>
                       <p className="text-slate-800 font-medium leading-relaxed italic">
                         "{paciente.ficha.evoluciones[0].descripcion}"
                       </p>
                       <div className="mt-6 pt-4 border-t border-[var(--sb-border)] flex justify-between items-center text-[10px] font-bold text-[var(--sb-text-muted)]">
                         <span>Registrado el {new Date(paciente.ficha.evoluciones[0].fecha || paciente.ficha.evoluciones[0].createdAt || '').toLocaleDateString()}</span>
                         <button onClick={() => setActiveTab('evoluciones')} className="text-blue-600 hover:underline">Ver historial completo ⮕</button>
                       </div>
                    </div>
                  )}
                </div>

                <aside className="space-y-6">
                  {/* Próximos Turnos Widget */}
                  <PremiumCard className="p-6 bg-white border-blue-100">
                    <h2 className="text-xs font-bold text-[var(--sb-text-muted)] uppercase tracking-widest mb-6 flex items-center justify-between">
                      Agenda Próxima
                      <div className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md text-[9px]">Sincronizado</div>
                    </h2>
                    <div className="space-y-4">
                      {turnos.length > 0 ? turnos.slice(0, 3).map(t => (
                        <div key={t.id} className="flex gap-4 p-3 rounded-2xl bg-[var(--sb-active-bg)] border border-[var(--sb-border)] transition-all hover:border-blue-200">
                          <div className="flex flex-col items-center justify-center h-12 w-12 rounded-xl bg-white border border-[var(--sb-border)] text-center shrink-0">
                            <span className="text-[10px] font-bold text-blue-500 uppercase">{new Date(t.fechaInicio).toLocaleString('es-ES', { month: 'short' })}</span>
                            <span className="text-lg font-black text-[var(--sb-text)] leading-none">{new Date(t.fechaInicio).getDate()}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-[var(--sb-text)] truncate uppercase mt-0.5">{t.motivo || 'Consulta General'}</p>
                            <p className="text-[10px] font-medium text-[var(--sb-text-muted)] uppercase tracking-tighter">
                              {new Date(t.fechaInicio).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} • Dr. {t.profesional?.usuario.nombre}
                            </p>
                          </div>
                        </div>
                      )) : (
                        <div className="text-center py-6">
                          <p className="text-[10px] font-bold text-[var(--sb-border)] uppercase tracking-widest">No hay turnos agendados</p>
                          <button onClick={() => navigate(`/agenda?pacienteId=${id}`)} className="mt-4 text-xs font-bold text-blue-600 hover:underline">Ir a la Agenda ⮕</button>
                        </div>
                      )}
                    </div>
                  </PremiumCard>
                </aside>
              </div>
            )}

            {activeTab === 'odontograma' && paciente.ficha && (
              <React.Suspense fallback={<div className="flex h-64 items-center justify-center"><div className="h-8 w-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" /></div>}>
                <OdontogramaManager fichaId={paciente.ficha.id} />
              </React.Suspense>
            )}

            {activeTab === 'odontograma' && !paciente.ficha && (
              <div className="medical-card p-10 text-center">
                <p className="text-slate-500 font-medium">No se pudo inicializar la ficha clínica para este paciente.</p>
              </div>
            )}

            {activeTab === 'periodontograma' && paciente.ficha && (
              <PeriodontogramaManager
                fichaId={paciente.ficha.id}
                pacienteId={paciente.id}
                mediciones={paciente.ficha.medicionesPeriodontales}
              />
            )}

            {activeTab === 'evoluciones' && (
              <EvolucionClinicaTimeline
                evoluciones={paciente.ficha?.evoluciones}
                onAdd={handleAddEvolucion}
                loading={createEvolucion.isPending}
              />
            )}

            {activeTab === 'tratamientos' && (
              <div className="space-y-10 max-w-4xl mx-auto">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-[var(--sb-text)] tracking-tight">Hoja de Ruta del Paciente</h2>
                    <p className="text-xs text-[var(--sb-text-muted)] font-bold uppercase tracking-widest">Progreso de Planes Clínicos</p>
                  </div>
                  <button
                    onClick={() => setShowNuevoPlanModal(true)}
                    className="btn-primary px-4 py-2 rounded-xl text-xs font-bold">
                    + Nuevo Plan
                  </button>
                </div>

                {planesTratamiento.length > 0 ? (
                  <div className="grid gap-12">
                    {planesTratamiento.map(plan => (
                      <TratamientoProgreso
                        key={plan.id}
                        plan={plan}
                        onUpdateEstado={(itemId, estado) => updateItemEstado({ itemId, estado })}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="medical-card p-20 text-center border-dashed border-[var(--sb-border)]">
                    <TrendingUp size={48} className="mx-auto text-[var(--sb-border)] mb-4" />
                    <p className="text-slate-500 font-medium">No se han definido planes de tratamiento para este paciente.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'documentos' && (
              <DocumentosPanel pacienteId={id!} />
            )}

            {activeTab === 'finanzas' && (
              <FinanzasTabContent
                pacienteId={id!}
                pacienteNombre={`${paciente.nombre} ${paciente.apellido}`}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditModal && (          <PacienteForm
            initialData={{
              nombre:          paciente.nombre,
              apellido:        paciente.apellido,
              documento:       paciente.documento,
              fechaNacimiento: paciente.fechaNacimiento ? String(paciente.fechaNacimiento).slice(0, 10) : '',
              genero:          paciente.genero,
              telefono:        paciente.telefono,
              email:           paciente.email ?? '',
              direccion:       paciente.direccion,
              obraSocial:      paciente.obraSocial,
              nroAfiliado:     paciente.nroAfiliado,
            }}
            loading={updatePaciente.isPending}
            onClose={() => setShowEditModal(false)}
            onSubmit={async (data) => {
              try {
                await updatePaciente.mutateAsync({ id: id!, data });
                setShowEditModal(false);
                toast.success('Paciente actualizado correctamente');
              } catch (err: any) {
                toast.error(err.message || 'Error al actualizar el paciente');
              }
            }}
          />
        )}
      </AnimatePresence>

      {/* Antecedente Modal */}
      <AnimatePresence>
        {showAntecedenteModal && paciente.ficha && (          <AntecedenteModal
            fichaId={paciente.ficha.id}
            loading={createAntecedente.isPending}
            onClose={() => setShowAntecedenteModal(false)}
            onSubmit={async (data) => {
              try {
                await createAntecedente.mutateAsync(data);
                toast.success('Antecedente registrado');
                setShowAntecedenteModal(false);
              } catch (err: any) {
                toast.error(err.message || 'Error al registrar antecedente');
              }
            }}
          />
        )}
      </AnimatePresence>

      {/* Nuevo Plan Modal */}
      <AnimatePresence>
        {showNuevoPlanModal && (
          <NuevoPlanModal
            pacienteId={id!}
            paciente={paciente}
            loading={isCreating}
            onClose={() => setShowNuevoPlanModal(false)}
            onSubmit={async (data) => {
              try {
                await createPlan(data);
                toast.success('Plan de tratamiento creado');
                setShowNuevoPlanModal(false);
              } catch (err: any) {
                toast.error(err.message || 'Error al crear el plan');
              }
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
