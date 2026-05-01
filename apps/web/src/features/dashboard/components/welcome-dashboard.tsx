import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Building, 
  UserPlus, 
  CalendarPlus, 
  RocketLaunch, 
  CheckCircle,
  CaretRight
} from '@phosphor-icons/react';
import { PremiumCard } from '../../../components/ui/premium-card';
import { useAuth } from '../../../context/auth-context';

interface WelcomeDashboardProps {
  stats: {
    totalProfesionales: number;
    totalConsultorios: number;
    totalPacientes: number;
  };
}

export const WelcomeDashboard: React.FC<WelcomeDashboardProps> = ({ stats }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const steps = [
    {
      id: 'consultorio',
      title: 'Crear su primera Sede / Consultorio',
      description: 'Defina dónde atenderá a sus pacientes. Puede agregar múltiples sedes más adelante.',
      icon: Building,
      isCompleted: stats.totalConsultorios > 0,
      action: () => navigate('/sedes'),
      buttonText: 'Configurar Consultorio',
    },
    {
      id: 'profesional',
      title: 'Agregar Profesionales',
      description: 'Registre a los doctores y especialistas que trabajarán en su clínica.',
      icon: UserPlus,
      isCompleted: stats.totalProfesionales > 0,
      action: () => navigate('/profesionales'),
      buttonText: 'Añadir Profesional',
    },
    {
      id: 'paciente',
      title: 'Registrar su Primer Paciente',
      description: 'Inicie su base de datos agregando un paciente nuevo para comenzar a operar.',
      icon: CalendarPlus,
      isCompleted: stats.totalPacientes > 0,
      action: () => navigate('/pacientes'),
      buttonText: 'Crear Paciente',
    }
  ];

  const completedSteps = steps.filter(s => s.isCompleted).length;
  const progress = (completedSteps / steps.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto py-8"
    >
      <PremiumCard className="overflow-hidden border-2 border-blue-500/20 shadow-2xl shadow-blue-500/10">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
            <RocketLaunch size={200} weight="fill" />
          </div>

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold uppercase tracking-widest mb-6">
              <RocketLaunch size={14} weight="bold" />
              <span>Primeros Pasos</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              ¡Bienvenido a OdontoSaaS, {user?.nombre}!
            </h1>
            <p className="text-blue-100 text-lg md:text-xl font-medium leading-relaxed max-w-xl">
              Su clínica ha sido creada exitosamente. Para comenzar a gestionar turnos y presupuestos, configure los siguientes elementos fundamentales.
            </p>
          </div>
        </div>

        <div className="p-8">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Progreso de configuración</span>
              <span className="text-sm font-bold text-blue-600">{Math.round(progress)}%</span>
            </div>
            <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
              />
            </div>
          </div>

          <div className="space-y-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div 
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className={`relative p-5 rounded-2xl border-2 transition-all duration-300 ${
                    step.isCompleted 
                      ? 'border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-500/5' 
                      : 'border-blue-500/20 bg-card hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/5'
                  }`}
                >
                  <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl flex-shrink-0 ${
                        step.isCompleted 
                          ? 'bg-emerald-500 text-white' 
                          : 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400'
                      }`}>
                        {step.isCompleted ? <CheckCircle size={24} weight="fill" /> : <Icon size={24} weight="bold" />}
                      </div>
                      <div>
                        <h3 className={`text-lg font-bold mb-1 ${step.isCompleted ? 'text-emerald-700 dark:text-emerald-400' : ''}`}>
                          {step.title}
                        </h3>
                        <p className="text-sm text-muted-foreground font-medium">
                          {step.description}
                        </p>
                      </div>
                    </div>
                    
                    <button
                      onClick={step.action}
                      disabled={step.isCompleted}
                      className={`flex-shrink-0 flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm tracking-wide transition-all ${
                        step.isCompleted
                          ? 'bg-transparent text-emerald-600 border border-emerald-200 dark:border-emerald-500/30 cursor-default opacity-60'
                          : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30'
                      }`}
                    >
                      {step.isCompleted ? 'Completado' : step.buttonText}
                      {!step.isCompleted && <CaretRight size={16} weight="bold" />}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </PremiumCard>
    </motion.div>
  );
};
