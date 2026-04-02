import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  Edit3, 
  ExternalLink, 
  User, 
  Phone, 
  Contact, 
  CalendarDays,
  MoreVertical,
  Activity,
  History,
  TrendingUp,
  CreditCard,
  Files
} from 'lucide-react';

// Hooks
import { usePacienteDetalle, useEvolucionMutations } from '../hooks/use-pacientes';
import { useTratamientos } from '../../tratamientos/hooks/use-tratamientos';
import { useTurnos } from '../../agenda/hooks/use-turnos';
import { usePacienteFinanzas } from '../../finanzas/hooks/use-presupuestos';

// Components
import { PacienteTabs } from '../components/PacienteTabs';
import { tabs } from '../constants';
import { AntecedentesAlerts } from '../components/AntecedentesAlerts';
import { EvolucionClinicaTimeline } from '../components/EvolucionClinicaTimeline';
import { DocumentosPanel } from '../components/DocumentosPanel';
import { PeriodontogramaManager } from '../components/PeriodontogramaManager';
import { OdontogramaManager } from '../../odontograma/components/OdontogramaManager';
import { TratamientoProgreso } from '../../tratamientos/components/TratamientoProgreso';
import { FinanzasTabContent } from '../../finanzas/components/FinanzasTabContent';
import { PremiumCard } from '@/components/ui/premium-card';
import { cn } from '@/lib/utils';

export const PacienteDetallePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('resumen');

  const { data: paciente, isLoading, error } = usePacienteDetalle(id!);
  const { createEvolucion } = useEvolucionMutations();
  const { planes: planesTratamiento, updateItemEstado } = useTratamientos(id);
  const { data: turnos = [] } = useTurnos({ pacienteId: id });
  const { data: presupuestos = [] } = usePacienteFinanzas(id!);

  if (isLoading) return (
    <div className="flex h-[60vh] flex-col items-center justify-center gap-4 text-slate-400">
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

  const balance = presupuestos.reduce((acc, curr) => {
    const total = Number(curr.total || 0);
    const pagado = (curr.pagos || []).reduce((pAcc, pCurr) => pAcc + Number(pCurr.monto), 0);
    return acc + (total - pagado);
  }, 0);

  const totalDeuda = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
  }).format(balance);

  const calculateAge = (birthday: string) => {
    const ageDifMs = Date.now() - new Date(birthday).getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  return (
    <div className="flex flex-col gap-6 pb-20 max-w-[1600px] mx-auto">
      {/* 360 Header Premium */}
      <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between bg-white dark:bg-slate-900 p-8 rounded-[3rem] shadow-medical border border-slate-100 dark:border-slate-800 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
           <User size={120} />
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
          <div className="h-24 w-24 rounded-[2rem] bg-gradient-to-br from-blue-600 to-indigo-700 p-0.5 shadow-xl shadow-blue-500/20">
             <div className="h-full w-full rounded-[2.1rem] bg-white dark:bg-slate-900 flex items-center justify-center text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-indigo-600">
               {paciente.nombre[0]}{paciente.apellido[0]}
             </div>
          </div>
          
          <div className="text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
               <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                 {paciente.nombre} {paciente.apellido}
               </h1>
               <div className="px-3 py-1 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest self-center">
                 Paciente Activo
               </div>
            </div>
            
               <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-bold text-slate-400">
                  <div className="flex items-center gap-1.5"><Contact size={14} /> {paciente.documento}</div>
                  <div className="h-1 w-1 rounded-full bg-slate-300" />
               <div className="flex items-center gap-1.5"><Phone size={14} /> {paciente.telefono}</div>
               <div className="h-1 w-1 rounded-full bg-slate-300" />
               <div className="flex items-center gap-1.5"><CalendarDays size={14} /> {calculateAge(paciente.fechaNacimiento)} Años</div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 relative z-10">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-95 shadow-sm">
            <Edit3 size={16} /> Editar Perfil
          </button>
          
          <button 
            onClick={() => navigate(`/pacientes/${id}/odontograma/${paciente.ficha?.id}`)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-500/25"
          >
            <ExternalLink size={16} /> Odontograma Full
          </button>
          
          <button className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors">
            <MoreVertical size={20} />
          </button>
        </div>
      </header>
      
      {/* Productivity Quick Jumps */}
      <div className="flex items-center gap-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-2 rounded-2xl border border-slate-100 dark:border-slate-800 self-start ml-4 -mt-2">
         <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-3 border-r border-slate-200 dark:border-slate-700">Accesos Rápidos</span>
          <div className="flex items-center gap-1">
            <button 
              disabled={!paciente.ficha}
              onClick={() => navigate(`/pacientes/${id}/odontograma/${paciente.ficha?.id}`)} 
              className="px-3 py-1.5 text-[11px] font-bold text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-xl transition-all disabled:opacity-50"
            >
              Odontograma
            </button>
            <button onClick={() => setActiveTab('finanzas')} className="px-3 py-1.5 text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all">Pagos & Deudas</button>
            <button onClick={() => setActiveTab('documentos')} className="px-3 py-1.5 text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all">Radiografías</button>
            <button onClick={() => setActiveTab('evoluciones')} className="px-3 py-1.5 text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all">Historia Clínica</button>
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
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Evoluciones</p>
                       <div className="flex items-center justify-between">
                         <span className="text-2xl font-black text-slate-900">{paciente.ficha?.evoluciones?.length || 0}</span>
                         <div className="p-2 bg-blue-50 rounded-xl text-blue-500"><History size={18}/></div>
                       </div>
                     </div>
                     <div className="medical-card p-6 border-l-4 border-l-emerald-500 bg-white shadow-medical">
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Tratamientos</p>
                       <div className="flex items-center justify-between">
                         <span className="text-2xl font-black text-slate-900">{planesTratamiento.length}</span>
                         <div className="p-2 bg-emerald-50 rounded-xl text-emerald-500"><TrendingUp size={18}/></div>
                       </div>
                     </div>
                      <div className="medical-card p-6 border-l-4 border-l-amber-500 bg-white shadow-medical">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Deuda Pendiente</p>
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

                  <AntecedentesAlerts antecedentes={paciente.ficha?.antecedentes} />
                  
                  {/* Last Note Preview */}
                  {paciente.ficha?.evoluciones?.[0] && (
                    <div className="medical-card p-8 bg-gradient-to-br from-white to-slate-50 border-slate-100 shadow-md">
                       <div className="flex items-center gap-2 mb-4">
                          <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Último Registro Clínico</h4>
                       </div>
                       <p className="text-slate-800 font-medium leading-relaxed italic">
                         "{paciente.ficha.evoluciones[0].descripcion}"
                       </p>
                       <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center text-[10px] font-bold text-slate-400">
                         <span>Registrado el {new Date(paciente.ficha.evoluciones[0].fechaRegistro).toLocaleDateString()}</span>
                         <button onClick={() => setActiveTab('evoluciones')} className="text-blue-600 hover:underline">Ver historial completo ⮕</button>
                       </div>
                    </div>
                  )}
                </div>

                <aside className="space-y-6">
                  {/* Próximos Turnos Widget */}
                  <PremiumCard className="p-6 bg-white border-blue-100">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center justify-between">
                      Agenda Próxima
                      <div className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md text-[9px]">Sincronizado</div>
                    </h3>
                    <div className="space-y-4">
                      {turnos.length > 0 ? turnos.slice(0, 3).map(t => (
                        <div key={t.id} className="flex gap-4 p-3 rounded-2xl bg-slate-50 border border-slate-100 transition-all hover:border-blue-200">
                          <div className="flex flex-col items-center justify-center h-12 w-12 rounded-xl bg-white border border-slate-200 text-center shrink-0">
                            <span className="text-[10px] font-bold text-blue-500 uppercase">{new Date(t.fechaInicio).toLocaleString('es-ES', { month: 'short' })}</span>
                            <span className="text-lg font-black text-slate-900 leading-none">{new Date(t.fechaInicio).getDate()}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-800 truncate uppercase mt-0.5">{t.motivo || 'Consulta General'}</p>
                            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-tighter">
                              {new Date(t.fechaInicio).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} • Dr. {t.profesional?.usuario.nombre}
                            </p>
                          </div>
                        </div>
                      )) : (
                        <div className="text-center py-6">
                          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">No hay turnos agendados</p>
                          <button onClick={() => navigate('/agenda')} className="mt-4 text-xs font-bold text-blue-600 hover:underline">Ir a la Agenda ⮕</button>
                        </div>
                      )}
                    </div>
                  </PremiumCard>
                </aside>
              </div>
            )}

            {activeTab === 'odontograma' && paciente.ficha && (
              <OdontogramaManager fichaId={paciente.ficha.id} />
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
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">Hoja de Ruta del Paciente</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Progreso de Planes Clínicos</p>
                  </div>
                  <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold shadow-lg shadow-slate-900/10 transition-all active:scale-95">
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
                  <div className="medical-card p-20 text-center border-dashed border-slate-200">
                    <TrendingUp size={48} className="mx-auto text-slate-200 mb-4" />
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
    </div>
  );
};
