import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Wallet, AlertCircle, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FinanzasPatientSummaryProps {
  total: number;
  pagado: number;
  pendiente: number;
}

export const FinanzasPatientSummary: React.FC<FinanzasPatientSummaryProps> = ({ total, pagado, pendiente }) => {
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(val);

  const stats = [
    {
      label: 'Total Presupuestado',
      value: formatCurrency(total),
      icon: CreditCard,
      color: 'blue',
      delay: 0
    },
    {
      label: 'Total Abonado',
      value: formatCurrency(pagado),
      icon: Wallet,
      color: 'emerald',
      delay: 0.1
    },
    {
      label: 'Saldo Pendiente',
      value: formatCurrency(pendiente),
      icon: AlertCircle,
      color: pendiente > 0 ? 'amber' : 'slate',
      delay: 0.2
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: stat.delay }}
          className={cn(
            "medical-card p-6 border-l-4 shadow-sm",
            stat.color === 'blue' && "border-l-blue-500",
            stat.color === 'emerald' && "border-l-emerald-500",
            stat.color === 'amber' && "border-l-amber-500",
            stat.color === 'slate' && "border-l-slate-200"
          )}
        >
          <div className="flex justify-between items-start mb-2">
            <p className="text-[10px] font-black text-[var(--sb-text-muted)] uppercase tracking-[0.15em]">
              {stat.label}
            </p>
            <div className={cn(
              "p-1.5 rounded-lg",
              stat.color === 'blue' && "bg-blue-50 text-blue-600",
              stat.color === 'emerald' && "bg-emerald-50 text-emerald-600",
              stat.color === 'amber' && "bg-amber-50 text-amber-600",
              stat.color === 'slate' && "bg-slate-50 text-[var(--sb-text-muted)]"
            )}>
              <stat.icon size={16} />
            </div>
          </div>
          <h4 className="text-2xl font-black text-[var(--sb-text)] tracking-tight">
            {stat.value}
          </h4>

          {stat.color === 'emerald' && pagado > 0 && (
            <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-emerald-600 uppercase">
              <TrendingUp size={10} />
              Sincronizado
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};
