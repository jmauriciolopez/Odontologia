import React from 'react';
import { Presupuesto } from '../types';
import { PlanTratamiento } from '../../tratamientos/types';

interface Props {
  presupuesto: Presupuesto;
  clinicaNombre?: string;
}

const fmt = (v: number) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(Number(v));

const estadoLabel: Record<string, string> = {
  pendiente: 'Pendiente',
  iniciado: 'Iniciado',
  pagado: 'Pagado',
  pagado_parcial: 'Pago Parcial',
  rechazado: 'Rechazado',
};

export const printPresupuesto = (presupuesto: Presupuesto, clinicaNombre = 'Clínica Odontológica', pacienteNombreFallback?: string) => {
  const saldo = Number(presupuesto.total) - Number(presupuesto.totalPagado || 0);
  const fecha = new Date(presupuesto.fechaPresupuesto).toLocaleDateString('es-AR', {
    day: '2-digit', month: 'long', year: 'numeric',
  });
  const paciente = presupuesto.paciente
    ? `${presupuesto.paciente.nombre} ${presupuesto.paciente.apellido}`
    : (pacienteNombreFallback || 'Paciente');

  const itemsRows = (presupuesto.items || []).map(item => `
    <tr>
      <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;">${item.descripcion}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;text-align:center;">${item.cantidad}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;text-align:right;">${fmt(item.precioUnitario)}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;text-align:right;font-weight:700;">${fmt(item.subtotal ?? Number(item.precioUnitario) * Number(item.cantidad))}</td>
    </tr>
  `).join('');

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <title>Presupuesto #${presupuesto.folio}</title>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family: 'Helvetica Neue', Arial, sans-serif; color:#1e293b; background:#fff; padding:40px; font-size:13px; }
    .header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:40px; padding-bottom:24px; border-bottom:2px solid #e2e8f0; }
    .clinic-name { font-size:22px; font-weight:800; color:#1e40af; letter-spacing:-0.5px; }
    .clinic-sub { font-size:11px; color:#64748b; margin-top:4px; text-transform:uppercase; letter-spacing:1px; }
    .doc-title { text-align:right; }
    .doc-title h1 { font-size:28px; font-weight:900; color:#0f172a; letter-spacing:-1px; }
    .doc-title .folio { font-size:13px; color:#64748b; margin-top:4px; }
    .doc-title .fecha { font-size:12px; color:#94a3b8; margin-top:2px; }
    .info-grid { display:grid; grid-template-columns:1fr 1fr; gap:24px; margin-bottom:32px; }
    .info-box { background:#f8fafc; border-radius:12px; padding:16px 20px; border:1px solid #e2e8f0; }
    .info-box label { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:#94a3b8; display:block; margin-bottom:6px; }
    .info-box .value { font-size:15px; font-weight:700; color:#1e293b; }
    .info-box .sub { font-size:11px; color:#64748b; margin-top:2px; }
    table { width:100%; border-collapse:collapse; margin-bottom:24px; }
    thead tr { background:#1e40af; color:#fff; }
    thead th { padding:12px; text-align:left; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:1px; }
    thead th:nth-child(2) { text-align:center; }
    thead th:nth-child(3), thead th:nth-child(4) { text-align:right; }
    tbody tr:hover { background:#f8fafc; }
    .totals { margin-left:auto; width:280px; }
    .totals-row { display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid #f1f5f9; font-size:13px; }
    .totals-row.total { border-bottom:none; border-top:2px solid #1e40af; margin-top:4px; padding-top:12px; }
    .totals-row.total span { font-size:18px; font-weight:900; color:#1e40af; }
    .totals-row.saldo span { color:#dc2626; font-weight:700; }
    .badge { display:inline-block; padding:4px 12px; border-radius:20px; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; }
    .badge-pendiente { background:#f1f5f9; color:#64748b; }
    .badge-pagado { background:#dcfce7; color:#16a34a; }
    .badge-pagado_parcial { background:#fef9c3; color:#ca8a04; }
    .badge-iniciado { background:#dbeafe; color:#1d4ed8; }
    .footer { margin-top:48px; padding-top:20px; border-top:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center; }
    .footer-note { font-size:11px; color:#94a3b8; }
    .signature { text-align:center; }
    .signature-line { width:180px; border-top:1px solid #cbd5e1; margin:0 auto 6px; }
    .signature-label { font-size:10px; color:#94a3b8; text-transform:uppercase; letter-spacing:1px; }
    @media print {
      body { padding:20px; }
      @page { margin:15mm; size:A4; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="clinic-name">${clinicaNombre}</div>
      <div class="clinic-sub">Odontología Profesional</div>
    </div>
    <div class="doc-title">
      <h1>PRESUPUESTO</h1>
      <div class="folio">#${presupuesto.folio || presupuesto.id.slice(0, 8).toUpperCase()}</div>
      <div class="fecha">${fecha}</div>
    </div>
  </div>

  <div class="info-grid">
    <div class="info-box">
      <label>Paciente</label>
      <div class="value">${paciente}</div>
    </div>
    <div class="info-box">
      <label>Estado</label>
      <div class="value">
        <span class="badge badge-${presupuesto.estado}">${estadoLabel[presupuesto.estado] || presupuesto.estado}</span>
      </div>
      <div class="sub">Emitido el ${fecha}</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Descripción</th>
        <th>Cant.</th>
        <th>Precio Unit.</th>
        <th>Subtotal</th>
      </tr>
    </thead>
    <tbody>
      ${itemsRows || '<tr><td colspan="4" style="padding:20px;text-align:center;color:#94a3b8;">Sin ítems</td></tr>'}
    </tbody>
  </table>

  <div class="totals">
    <div class="totals-row">
      <span style="color:#64748b;">Subtotal</span>
      <span>${fmt(presupuesto.total)}</span>
    </div>
    <div class="totals-row">
      <span style="color:#64748b;">Total Abonado</span>
      <span style="color:#16a34a;">${fmt(presupuesto.totalPagado || 0)}</span>
    </div>
    <div class="totals-row total ${saldo > 0 ? 'saldo' : ''}">
      <span style="font-weight:700;color:#0f172a;">${saldo > 0 ? 'Saldo Pendiente' : 'TOTAL'}</span>
      <span>${fmt(saldo > 0 ? saldo : presupuesto.total)}</span>
    </div>
  </div>

  <div class="footer">
    <div class="footer-note">
      Este presupuesto tiene validez de 30 días desde su emisión.<br/>
      Los precios pueden estar sujetos a cambios sin previo aviso.
    </div>
    <div class="signature">
      <div class="signature-line"></div>
      <div class="signature-label">Firma y Sello Profesional</div>
    </div>
  </div>
</body>
</html>`;

  const win = window.open('', '_blank', 'width=900,height=700');
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => {
    win.print();
    win.close();
  }, 300);
};

const estadoItemLabel: Record<string, string> = {
  pendiente: 'Pendiente',
  iniciado: 'En Progreso',
  realizado: 'Realizado',
  cancelado: 'Cancelado',
};

export const printPlanTratamiento = (plan: PlanTratamiento, clinicaNombre = 'Clínica Odontológica') => {
  const paciente = plan.paciente
    ? `${plan.paciente.nombre} ${plan.paciente.apellido}`
    : 'Paciente';
  const profesional = plan.profesional
    ? `Dr. ${plan.profesional.usuario.nombre} ${plan.profesional.usuario.apellido}`
    : '';
  const fecha = new Date(plan.createdAt).toLocaleDateString('es-AR', {
    day: '2-digit', month: 'long', year: 'numeric',
  });
  const total = (plan.items || []).reduce((acc, it) => acc + Number(it.precioRef || 0), 0);
  const completados = (plan.items || []).filter(it => it.estado === 'realizado').length;
  const progreso = plan.items?.length ? Math.round((completados / plan.items.length) * 100) : 0;

  const itemsRows = (plan.items || []).map(item => `
    <tr>
      <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;">${item.tipo}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;text-align:center;">${item.piezaPosicion || '—'}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;text-align:center;">${item.cara || '—'}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;text-align:right;">${fmt(item.precioRef)}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;text-align:center;">
        <span style="padding:2px 8px;border-radius:20px;font-size:10px;font-weight:700;
          background:${item.estado === 'realizado' ? '#dcfce7' : item.estado === 'iniciado' ? '#fef9c3' : '#f1f5f9'};
          color:${item.estado === 'realizado' ? '#16a34a' : item.estado === 'iniciado' ? '#ca8a04' : '#64748b'};">
          ${estadoItemLabel[item.estado] || item.estado}
        </span>
      </td>
    </tr>
  `).join('');

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <title>Plan de Tratamiento — ${plan.nombre}</title>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family: 'Helvetica Neue', Arial, sans-serif; color:#1e293b; background:#fff; padding:40px; font-size:13px; }
    .header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:40px; padding-bottom:24px; border-bottom:2px solid #e2e8f0; }
    .clinic-name { font-size:22px; font-weight:800; color:#1e40af; letter-spacing:-0.5px; }
    .clinic-sub { font-size:11px; color:#64748b; margin-top:4px; text-transform:uppercase; letter-spacing:1px; }
    .doc-title { text-align:right; }
    .doc-title h1 { font-size:22px; font-weight:900; color:#0f172a; letter-spacing:-0.5px; }
    .doc-title .sub { font-size:12px; color:#64748b; margin-top:4px; }
    .info-grid { display:grid; grid-template-columns:1fr 1fr 1fr; gap:16px; margin-bottom:32px; }
    .info-box { background:#f8fafc; border-radius:12px; padding:14px 18px; border:1px solid #e2e8f0; }
    .info-box label { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:#94a3b8; display:block; margin-bottom:5px; }
    .info-box .value { font-size:14px; font-weight:700; color:#1e293b; }
    .progress-bar { height:8px; background:#e2e8f0; border-radius:99px; overflow:hidden; margin-bottom:32px; }
    .progress-fill { height:100%; background:linear-gradient(90deg,#2563eb,#6366f1); border-radius:99px; width:${progreso}%; }
    .progress-label { font-size:11px; color:#64748b; margin-bottom:6px; display:flex; justify-content:space-between; }
    table { width:100%; border-collapse:collapse; margin-bottom:24px; }
    thead tr { background:#1e40af; color:#fff; }
    thead th { padding:12px; text-align:left; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:1px; }
    thead th:nth-child(2),thead th:nth-child(3),thead th:nth-child(5) { text-align:center; }
    thead th:nth-child(4) { text-align:right; }
    .total-row { display:flex; justify-content:flex-end; gap:32px; padding:12px 0; border-top:2px solid #1e40af; margin-top:4px; }
    .total-row span { font-size:16px; font-weight:900; color:#1e40af; }
    .footer { margin-top:48px; padding-top:20px; border-top:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center; }
    .footer-note { font-size:11px; color:#94a3b8; }
    .signature { text-align:center; }
    .signature-line { width:180px; border-top:1px solid #cbd5e1; margin:0 auto 6px; }
    .signature-label { font-size:10px; color:#94a3b8; text-transform:uppercase; letter-spacing:1px; }
    @media print { body { padding:20px; } @page { margin:15mm; size:A4; } }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="clinic-name">${clinicaNombre}</div>
      <div class="clinic-sub">Odontología Profesional</div>
    </div>
    <div class="doc-title">
      <h1>PLAN DE TRATAMIENTO</h1>
      <div class="sub">${plan.nombre}</div>
      <div class="sub" style="color:#94a3b8;margin-top:2px;">${fecha}</div>
    </div>
  </div>

  <div class="info-grid">
    <div class="info-box">
      <label>Paciente</label>
      <div class="value">${paciente}</div>
    </div>
    <div class="info-box">
      <label>Profesional</label>
      <div class="value">${profesional}</div>
    </div>
    <div class="info-box">
      <label>Estado del Plan</label>
      <div class="value">${plan.estado.charAt(0).toUpperCase() + plan.estado.slice(1)}</div>
    </div>
  </div>

  <div class="progress-label">
    <span>Progreso del tratamiento</span>
    <span>${completados} de ${plan.items?.length || 0} procedimientos completados — ${progreso}%</span>
  </div>
  <div class="progress-bar"><div class="progress-fill"></div></div>

  <table>
    <thead>
      <tr>
        <th>Procedimiento</th>
        <th>Pieza</th>
        <th>Cara</th>
        <th>Precio Ref.</th>
        <th>Estado</th>
      </tr>
    </thead>
    <tbody>
      ${itemsRows || '<tr><td colspan="5" style="padding:20px;text-align:center;color:#94a3b8;">Sin procedimientos</td></tr>'}
    </tbody>
  </table>

  <div class="total-row">
    <span style="font-weight:500;color:#64748b;font-size:14px;">Total Estimado:</span>
    <span>${fmt(total)}</span>
  </div>

  ${plan.notas ? `<div style="margin-top:24px;padding:16px 20px;background:#fffbeb;border-radius:12px;border:1px solid #fde68a;">
    <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#92400e;margin-bottom:6px;">Notas Clínicas</div>
    <div style="font-size:13px;color:#78350f;font-style:italic;">"${plan.notas}"</div>
  </div>` : ''}

  <div class="footer">
    <div class="footer-note">
      Los precios de referencia pueden variar según evolución del tratamiento.<br/>
      Documento generado el ${new Date().toLocaleDateString('es-AR')}.
    </div>
    <div class="signature">
      <div class="signature-line"></div>
      <div class="signature-label">Firma y Sello Profesional</div>
    </div>
  </div>
</body>
</html>`;

  const win = window.open('', '_blank', 'width=900,height=700');
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => { win.print(); win.close(); }, 300);
};
