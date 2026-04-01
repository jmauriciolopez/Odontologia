import React, { useState } from 'react';
import { Presupuesto } from '../types';

interface PagoModalProps {
  presupuesto: Presupuesto;
  onClose: () => void;
  onSubmit: (data: any) => void;
  loading: boolean;
}

export const PagoModal: React.FC<PagoModalProps> = ({ presupuesto, onClose, onSubmit, loading }) => {
  const [monto, setMonto] = useState(presupuesto.total - (presupuesto.pagos?.reduce((acc, p) => acc + Number(p.monto), 0) || 0));
  const [metodoPago, setMetodoPago] = useState('efectivo');
  const [notas, setNotas] = useState('');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      presupuestoId: presupuesto.id,
      monto,
      metodoPago,
      notas
    });
  };

  const totalPagado = presupuesto.pagos?.reduce((acc, p) => acc + Number(p.monto), 0) || 0;
  const saldoPendiente = presupuesto.total - totalPagado;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', margin: '1rem' }}>
        <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem' }}>Registrar Pago</h2>
          <button onClick={onClose} style={{ background: 'transparent', color: 'var(--text-muted)', fontSize: '1.25rem', padding: '0.25rem' }}>✕</button>
        </div>

        <div className="flex flex-col gap-3" style={{ marginBottom: '1.5rem', padding: '1rem', background: 'var(--bg-app)', borderRadius: 'var(--radius)' }}>
          <div className="flex justify-between items-center">
            <span className="text-muted" style={{ fontSize: '0.875rem' }}>Total Presupuesto:</span>
            <span style={{ fontWeight: 600 }}>${presupuesto.total.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted" style={{ fontSize: '0.875rem' }}>Pagado a la fecha:</span>
            <span style={{ fontWeight: 600, color: 'var(--success)' }}>${totalPagado.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center" style={{ borderTop: '1px solid var(--border)', paddingTop: '0.5rem' }}>
            <span style={{ fontWeight: 700 }}>Saldo Pendiente:</span>
            <span style={{ fontWeight: 700, color: 'var(--danger)' }}>${saldoPendiente.toLocaleString()}</span>
          </div>
        </div>

        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Monto a Pagar</label>
            <input 
              type="number" 
              className="input" 
              value={monto} 
              onChange={e => setMonto(parseFloat(e.target.value))} 
              max={saldoPendiente}
              required 
            />
          </div>

          <div className="flex flex-col gap-1">
            <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Método de Pago</label>
            <select className="input" value={metodoPago} onChange={e => setMetodoPago(e.target.value)} required>
              <option value="efectivo">Efectivo</option>
              <option value="transferencia">Transferencia</option>
              <option value="tarjeta">Tarjeta (Débito/Crédito)</option>
              <option value="obra_social">Obra Social / Prepaga</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Notas</label>
            <textarea className="input" rows={2} style={{ resize: 'none' }} value={notas} onChange={e => setNotas(e.target.value)} />
          </div>

          <button type="submit" className="btn-primary" disabled={loading || monto <= 0} style={{ marginTop: '0.5rem' }}>
            {loading ? 'Procesando...' : 'Confirmar Pago'}
          </button>
        </form>
      </div>
    </div>
  );
};
