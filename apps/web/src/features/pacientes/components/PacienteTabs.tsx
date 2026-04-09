import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { tabs, Tab } from '../constants';

interface PacienteTabsProps {
  activeTab: string;
  onTabChange: (id: string) => void;
}

export const PacienteTabs: React.FC<PacienteTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex items-center gap-1 p-1 bg-[var(--sb-active-bg)]/50 rounded-2xl border border-[var(--sb-border)] self-start mb-6">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all",
              isActive
                ? "text-blue-600 dark:text-blue-400"
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-[var(--card-bg)] rounded-xl shadow-sm border border-[var(--sb-border)]"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <Icon size={16} />
              <span className="hidden sm:inline">{tab.label}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
};
