import React, { useState } from 'react';

interface PresupuestoFormProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
  loading: boolean;
}

export const PresupuestoForm: React.FC<PresupuestoFormProps> = ({ onClose, onSubmit, loading }) => {
  const [pacienteId, setPacienteId] = useState('');
  const [descuento, setDescuento] = useState(0);
  const [items, setItems] = useState([{ descripcion: '', cantidad: 1, precioUnitario: 0 }]);

  const handleAddItem = () => {
    setItems([...items, { descripcion: '', cantidad: 1, precioUnitario: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleInputChange = (index: number, field: string, value: any) => {
    const newItems = [...items];
    (newItems as any)[index][field] = value;
    setItems(newItems);
  };

  const subtotal = items.reduce((acc, item) => acc + (item.cantidad * item.precioUnitario), 0);
  const total = subtotal - (subtotal * (descuento / 100));

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      pacienteId,
      descuento,
      items: items.filter(i => i.descripcion.trim())
    });
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div className="card" style={{ width: '100%', maxWidth: '700px', margin: '1rem', maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem' }}>Nuevo Presupuesto</h2>
          <button onClick={onClose} style={{ background: 'transparent', color: 'var(--text-muted)', fontSize: '1.25rem', padding: '0.25rem' }}>✕</button>
        </div>

        <form onSubmit={handleFormSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>ID Paciente (UUID)</label>
            <input 
              className="input" 
              placeholder="Ingrese el ID del paciente..." 
              value={pacienteId} 
              onChange={e => setPacienteId(e.target.value)}
              required 
            />
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>Detalle de Tratamientos</span>
              <button type="button" className="btn-primary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }} onClick={handleAddItem}>
                ➕ Agregar Ítem
              </button>
            </div>

            {items.map((item, index) => (
              <div key={index} className="grid" style={{ gridTemplateColumns: '2fr 80px 120px 40px', gap: '0.5rem', alignItems: 'end' }}>
                <div className="flex flex-col gap-1">
                  <label style={{ fontSize: '0.75rem' }}>Descripción</label>
                  <input className="input" value={item.descripcion} onChange={e => handleInputChange(index, 'descripcion', e.target.value)} placeholder="Limpieza, Carilla..." required />
                </div>
                <div className="flex flex-col gap-1">
                  <label style={{ fontSize: '0.75rem' }}>Cant.</label>
                  <input type="number" className="input" value={item.cantidad} onChange={e => handleInputChange(index, 'cantidad', parseInt(e.target.value))} required />
                </div>
                <div className="flex flex-col gap-1">
                  <label style={{ fontSize: '0.75rem' }}>Unitario</label>
                  <input type="number" className="input" value={item.precioUnitario} onChange={e => handleInputChange(index, 'precioUnitario', parseFloat(e.target.value))} required />
                </div>
                <button type="button" onClick={() => handleRemoveItem(index)} style={{ padding: '0.5rem', color: 'var(--danger)', background: 'transparent' }}>🗑️</button>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3" style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
            <div className="flex justify-between items-center">
              <span className="text-muted">Subtotal:</span>
              <span style={{ fontWeight: 600 }}>${subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center gap-4">
              <span className="text-muted">Descuento (%):</span>
              <input type="number" className="input" style={{ width: '80px', textAlign: 'right' }} value={descuento} onChange={e => setDescuento(parseFloat(e.target.value))} />
            </div>
            <div className="flex justify-between items-center" style={{ fontSize: '1.25rem', color: 'var(--primary)' }}>
              <span style={{ fontWeight: 700 }}>TOTAL:</span>
              <span style={{ fontWeight: 800 }}>${total.toLocaleString()}</span>
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading || items.length === 0} style={{ marginTop: '0.5rem' }}>
            {loading ? 'Creando...' : 'Generar Presupuesto'}
          </button>
        </form>
      </div>
    </div>
  );
};
