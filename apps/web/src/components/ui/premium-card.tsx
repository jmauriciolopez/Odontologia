import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PremiumCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  onClick?: () => void;
}

export const PremiumCard: React.FC<PremiumCardProps> = ({
  children,
  className,
  delay = 0,
  onClick,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      onClick={onClick}
      className={cn('rounded-2xl p-6 transition-all duration-300', className)}
      style={{
        background:    'var(--card-bg)',
        border:        '1px solid var(--card-border)',
        boxShadow:     'var(--card-shadow)',
        backdropFilter:'blur(var(--card-blur, 0px))',
        color:         'var(--sb-text)',
      }}
    >
      {children}
    </motion.div>
  );
};
