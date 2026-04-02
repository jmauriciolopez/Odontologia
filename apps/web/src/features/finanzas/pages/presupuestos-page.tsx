import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePresupuestos, useFinanzasMutations } from '../hooks/use-presupuestos';
import { PresupuestoList } from '../components/presupuesto-list';
import { PresupuestoForm } from '../components/presupuesto-form';
import { PagoModal } from '../components/pago-modal';
import { Presupuesto } from '../types';
import { PremiumCard } from '../../../components/ui/premium-card';
import { DollarSign, CreditCard, PieChart, Plus, ArrowUpRight, TrendingUp, Wallet, Receipt } from 'lucide-react';
import { cn } from '@/lib/utils';

export const PresupuestosPage: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPresupuesto, setSelectedPresupuesto] = useState<Presupuesto | null>(null);
  const [showPagoModal, setShowPagoModal] = useState(false);

  const { data: presupuestos = [], isLoading } = usePresupuestos();
  const { createPresupuesto, registerPago } = useFinanzasMutations();

  const handleCreate = async (data: any) => {
    try {
      await createPresupuesto.mutateAsync(data);
      setShowCreateModal(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleRegisterPago = async (data: any) => {
    try {
      await registerPago.mutateAsync(data);
      setShowPagoModal(false);
      setSelectedPresupuesto(null);
    } catch (e) {
      console.error(e);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);
  };

  // Mock aggregates based on the actual list for the UI demo
  const totalFacturado = presupuestos.reduce((acc, p) => acc + p.total, 0);
  const totalPagado = presupuestos.reduce((acc, p) => acc + (p.estado === 'pagado' ? p.total : 0), 0);
  const saldoPendiente = totalFacturado - totalPagado;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-8 pb-10"
    >
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <motion.h1 
            variants={itemVariants}
            className="font-heading text-3xl font-bold tracking-tight text-slate-900 dark:text-white"
          >
            Presupuestos y Facturación 💰
          </motion.h1>
          <motion.p 
            variants={itemVariants}
            className="text-slate-500 dark:text-slate-400 font-medium"
          >
            Gestione planes de tratamiento y controle el flujo financiero de su clínica.
          </motion.p>
        </div>
        
        <motion.button 
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-500/25 transition-all"
        >
          <Plus size={20} />
          Nuevo Presupuesto
        </motion.button>
      </header>

      {/* Financial Overview Tags */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PremiumCard delay={0.1}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-500/10">
              <Receipt className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
            <div className="flex items-center gap-1 text-emerald-500 font-bold text-xs">
              <TrendingUp size={14} />
              +8%
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Facturado</p>
            <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {formatCurrency(totalFacturado || 1240000)}
            </h3>
          </div>
        </PremiumCard>

        <PremiumCard delay={0.2}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10">
              <Wallet className="text-emerald-600 dark:text-emerald-400" size={24} />
            </div>
            <ArrowUpRight className="text-slate-200 dark:text-slate-800" size={20} />
          </div>
          <div className="space-y-1">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Cobros Realizados</p>
            <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {formatCurrency(totalPagado || 790000)}
            </h3>
          </div>
        </PremiumCard>

        <PremiumCard delay={0.3}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-500/10">
              <PieChart className="text-amber-600 dark:text-amber-400" size={24} />
            </div>
            <div className="h-2 w-12 bg-amber-200 dark:bg-amber-900/50 rounded-full overflow-hidden">
               <div className="h-full bg-amber-500 w-[60%]" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Saldo Pendiente</p>
            <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {formatCurrency(saldoPendiente || 450000)}
            </h3>
          </div>
        </PremiumCard>
      </div>

      {/* Main List Section */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-xl font-bold text-slate-900 dark:text-white">Listado de Presupuestos</h2>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest px-3 py-1.5 bg-slate-100 dark:bg-slate-800/50 rounded-full">
            <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            {presupuestos.length} Registros
          </div>
        </div>
        
        <PresupuestoList 
          presupuestos={presupuestos} 
          isLoading={isLoading} 
          onSelect={(p) => {
            setSelectedPresupuesto(p);
            setShowPagoModal(true);
          }}
        />
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {showCreateModal && (
          <PresupuestoForm 
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleCreate}
            loading={createPresupuesto.isPending}
          />
        )}

        {showPagoModal && selectedPresupuesto && (
          <PagoModal 
            presupuesto={selectedPresupuesto}
            onClose={() => {
              setShowPagoModal(false);
              setSelectedPresupuesto(null);
            }}
            onSubmit={handleRegisterPago}
            loading={registerPago.isPending}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};
