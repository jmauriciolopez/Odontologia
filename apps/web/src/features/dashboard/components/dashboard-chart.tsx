import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { HistoricalStat } from '../api/dashboard-api';
import { PremiumCard } from '../../../components/ui/premium-card';

interface DashboardChartProps {
  data: HistoricalStat[];
  isLoading: boolean;
}

export const DashboardChart: React.FC<DashboardChartProps> = ({ data, isLoading }) => {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(value);

  const formatMonth = (monthValue: any) => {
    if (typeof monthValue !== 'string') return '';
    const [year, month] = monthValue.split('-');
    if (!year || !month) return monthValue;
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleString('es-ES', { month: 'short', year: '2-digit' });
  };

  if (isLoading) {
    return (
      <PremiumCard className="h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin" />
          <p className="text-sm text-muted-foreground animate-pulse">Cargando gráfico histórico...</p>
        </div>
      </PremiumCard>
    );
  }

  return (
    <PremiumCard className="p-6">
      <div className="mb-6">
        <h3 className="font-heading text-lg font-bold tracking-tighter">Evolución Mensual</h3>
        <p className="text-sm font-medium opacity-60" style={{ color: 'var(--sb-text-muted)' }}>Ingresos vs Tratamientos Realizados</p>
      </div>

      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 10, right: 10, bottom: 0, left: 0 }}
          >
            <defs>
              <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--sb-primary, #3b82f6)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--sb-primary, #3b82f6)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--sb-border)" />
             <XAxis
              dataKey="month"
              tickFormatter={formatMonth}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: 'var(--sb-text-muted)', fontWeight: 500, fontFamily: 'Geist Mono' }}
              dy={10}
            />
            <YAxis
              yAxisId="left"
              tickFormatter={formatCurrency}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: 'var(--sb-text-muted)', fontWeight: 500, fontFamily: 'Geist Mono' }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: 'var(--sb-text-muted)', fontWeight: 500, fontFamily: 'Geist Mono' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(10px)',
                borderColor: 'rgba(255, 255, 255, 0.5)',
                borderRadius: '12px',
                fontSize: '11px',
                fontFamily: 'Geist Mono',
                boxShadow: 'var(--shadow-glass)',
                padding: '12px'
              }}
              formatter={(value: any, name: any) => {
                if (name === 'ingresos') return [formatCurrency(value), 'Ingresos'];
                return [value, 'Tratamientos'];
              }}
              labelFormatter={formatMonth}
            />
            <Legend verticalAlign="top" height={36} />
            <Bar
              yAxisId="left"
              dataKey="ingresos"
              name="ingresos"
              fill="url(#colorIngresos)"
              radius={[4, 4, 0, 0]}
              barSize={32}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="tratamientos"
              name="tratamientos"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </PremiumCard>
  );
};
