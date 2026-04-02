import { 
  ClipboardList, 
  Activity, 
  Stethoscope, 
  TrendingUp, 
  FileText, 
  Wallet,
  Grid3X3,
  LucideIcon
} from 'lucide-react';

export interface Tab {
  id: string;
  label: string;
  icon: LucideIcon;
}

export const tabs: Tab[] = [
  { id: 'resumen', label: 'Resumen', icon: ClipboardList },
  { id: 'odontograma', label: 'Odontograma', icon: Stethoscope },
  { id: 'evoluciones', label: 'Evolución', icon: Activity },
  { id: 'tratamientos', label: 'Tratamientos', icon: TrendingUp },
  { id: 'periodontograma', label: 'Perio', icon: Grid3X3 },
  { id: 'documentos', label: 'Documentos', icon: FileText },
  { id: 'finanzas', label: 'Finanzas', icon: Wallet },
];
