import React from 'react';
import { useAuth } from '../../context/auth-context';
import { motion } from 'framer-motion';
import { Clock, WarningCircle, Users } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { useDashboard } from '../../features/dashboard/hooks/use-dashboard';

export const TrialStatus: React.FC = () => {
  const { user } = useAuth();
  const { data: stats } = useDashboard();
  const clinica = user?.clinica;

  if (!clinica || clinica.plan !== 'TRIAL') return null;

  const trialEnd = new Date(clinica.trialExpiresAt);
  const now = new Date();
  const diffTime = trialEnd.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const isExpired = diffDays <= 0;

  const patientCount = stats?.totalPacientes || 0;
  const maxPatients = clinica.maxPatients;
  const patientLimitReached = patientCount >= maxPatients;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "mx-4 mb-4 p-4 rounded-2xl border transition-all duration-300",
        (isExpired || patientLimitReached)
          ? "bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400"
          : diffDays <= 7
            ? "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400"
            : "bg-primary/10 border-primary/20 text-primary"
      )}
    >
      {/* Trial Date Info */}
      <div className="flex items-start gap-3 mb-4">
        <div className={cn(
          "p-2 rounded-lg shrink-0",
          isExpired ? "bg-rose-500 text-white" : diffDays <= 7 ? "bg-amber-500 text-white" : "bg-primary text-white"
        )}>
          {isExpired ? <WarningCircle size={18} weight="bold" /> : <Clock size={18} weight="bold" />}
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-black uppercase tracking-wider">
            {isExpired ? 'Trial Expirado' : 'Periodo de Prueba'}
          </span>
          <span className="text-[10px] font-bold opacity-80 mt-0.5">
            {isExpired 
              ? 'Funciones restringidas' 
              : `Finaliza en ${diffDays} ${diffDays === 1 ? 'día' : 'días'}`
            }
          </span>
        </div>
      </div>

      {/* Patient Limit Info */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between items-center px-1">
          <div className="flex items-center gap-1.5 opacity-80">
            <Users size={12} weight="bold" />
            <span className="text-[10px] font-black uppercase tracking-tighter">Pacientes</span>
          </div>
          <span className="text-[10px] font-bold">
            {patientCount} / {maxPatients}
          </span>
        </div>
        <div className="relative h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.max(0, Math.min(100, (patientCount / maxPatients) * 100))}%` }}
            className={cn(
              "absolute inset-y-0 left-0 rounded-full",
              patientLimitReached ? "bg-rose-500" : "bg-primary"
            )}
          />
        </div>
      </div>

      <button
        onClick={() => {}}
        className={cn(
          "w-full py-2.5 px-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
          (isExpired || patientLimitReached)
            ? "bg-rose-500 text-white shadow-lg shadow-rose-500/20 hover:bg-rose-600"
            : "bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary-dark"
        )}
      >
        Actualizar Plan
      </button>
    </motion.div>
  );
};
