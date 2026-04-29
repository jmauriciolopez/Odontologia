import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import { Buffer } from 'buffer';

@Injectable()
export class PdfService {
  private drawHeader(doc: any, title: string) {
    // Background for header
    doc.rect(0, 0, 612, 100).fillColor('#f8fafc').fill();

    // Logo Placeholder (Premium Stylized)
    doc.save();
    doc.translate(50, 30);
    
    // Tooth-like shape or abstract dental logo
    doc.fillColor('#2563eb'); // Primary Blue
    doc.path('M 0 10 C 0 0 10 0 10 0 C 20 0 20 10 20 10 C 20 20 10 25 10 25 C 10 25 0 20 0 10 Z')
       .fill();
    
    doc.restore();

    doc.fillColor('#1e293b');
    doc.fontSize(20).font('Helvetica-Bold').text('SMILE DENTAL', 80, 35);
    doc.fontSize(10).font('Helvetica').text('Clínica Odontológica Integral', 80, 55);
    
    doc.fontSize(12).font('Helvetica-Bold').text(title, 400, 35, { align: 'right' });
    doc.fontSize(9).font('Helvetica').text(`Generado: ${new Date().toLocaleString('es-AR')}`, 400, 55, { align: 'right' });
    
    doc.moveTo(50, 90).lineTo(562, 90).strokeColor('#e2e8f0').lineWidth(1).stroke();
    doc.moveDown(4);
  }

  private drawFooter(doc: any) {
    const range = doc.bufferedPageRange();
    for (let i = range.start; i < range.start + range.count; i++) {
      doc.switchToPage(i);
      doc.fontSize(8).fillColor('#94a3b8').text(
        `Página ${i + 1} de ${range.count} - Smile Dental ERP`,
        50,
        760,
        { align: 'center' }
      );
    }
  }

  async generateDashboardReport(data: any[]): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new (PDFDocument as any)({ margin: 50, bufferPages: true });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => {
        this.drawFooter(doc);
        resolve(Buffer.concat(chunks));
      });
      doc.on('error', (err: Error) => reject(err));

      this.drawHeader(doc, 'REPORTE HISTÓRICO');

      // Table Header
      const tableTop = 130;
      doc.fillColor('#334155').fontSize(10).font('Helvetica-Bold');
      doc.text('PERIODO (MES)', 50, tableTop);
      doc.text('INGRESOS TOTALES', 200, tableTop);
      doc.text('TRATAMIENTOS REALIZADOS', 380, tableTop);
      
      doc.moveTo(50, tableTop + 15).lineTo(562, tableTop + 15).strokeColor('#cbd5e1').stroke();

      let currentY = tableTop + 25;
      doc.font('Helvetica').fillColor('#475569');

      data.forEach((item: any) => {
        doc.text(item.month, 50, currentY);
        doc.text(`$${item.ingresos.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`, 200, currentY);
        doc.text(item.tratamientos.toString(), 380, currentY);
        currentY += 20;

        if (currentY > 700) {
          doc.addPage();
          this.drawHeader(doc, 'REPORTE HISTÓRICO');
          currentY = 130;
        }
      });

      doc.end();
    });
  }

  async generateCobranzaReport(pagos: any[]): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new (PDFDocument as any)({ margin: 50, bufferPages: true });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => {
        this.drawFooter(doc);
        resolve(Buffer.concat(chunks));
      });
      doc.on('error', (err: Error) => reject(err));

      this.drawHeader(doc, 'REPORTE DE COBRANZA');

      const tableTop = 130;
      doc.fillColor('#334155').fontSize(9).font('Helvetica-Bold');
      doc.text('FECHA', 50, tableTop);
      doc.text('PACIENTE', 120, tableTop);
      doc.text('MÉTODO', 300, tableTop);
      doc.text('MONTO', 480, tableTop);
      
      doc.moveTo(50, tableTop + 15).lineTo(562, tableTop + 15).strokeColor('#cbd5e1').stroke();

      let currentY = tableTop + 25;
      doc.font('Helvetica').fillColor('#475569').fontSize(8);

      let total = 0;
      pagos.forEach((pago: any) => {
        const fecha = new Date(pago.fechaPago).toLocaleDateString('es-AR');
        const paciente = pago.presupuesto?.paciente?.nombre || 'N/A';
        const metodo = pago.metodoPago || 'Efectivo';
        const monto = parseFloat(pago.monto);
        total += monto;

        doc.text(fecha, 50, currentY);
        doc.text(paciente, 120, currentY, { width: 170 });
        doc.text(metodo, 300, currentY);
        doc.text(`$${monto.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`, 480, currentY);
        currentY += 18;

        if (currentY > 700) {
          doc.addPage();
          this.drawHeader(doc, 'REPORTE DE COBRANZA');
          currentY = 130;
        }
      });

      doc.fontSize(10).font('Helvetica-Bold').fillColor('#1e293b');
      doc.text(`TOTAL RECAUDADO: $${total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`, 350, currentY + 10);

      doc.end();
    });
  }

  async generateNuevosPacientesReport(pacientes: any[]): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new (PDFDocument as any)({ margin: 50, bufferPages: true });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => {
        this.drawFooter(doc);
        resolve(Buffer.concat(chunks));
      });
      doc.on('error', (err: Error) => reject(err));

      this.drawHeader(doc, 'NUEVOS PACIENTES');

      const tableTop = 130;
      doc.fillColor('#334155').fontSize(9).font('Helvetica-Bold');
      doc.text('FECHA REG.', 50, tableTop);
      doc.text('NOMBRE COMPLETO', 130, tableTop);
      doc.text('DNI', 320, tableTop);
      doc.text('TELÉFONO', 420, tableTop);
      
      doc.moveTo(50, tableTop + 15).lineTo(562, tableTop + 15).strokeColor('#cbd5e1').stroke();

      let currentY = tableTop + 25;
      doc.font('Helvetica').fillColor('#475569').fontSize(8);

      pacientes.forEach((paciente: any) => {
        const fecha = new Date(paciente.createdAt).toLocaleDateString('es-AR');
        doc.text(fecha, 50, currentY);
        doc.text(paciente.nombre, 130, currentY, { width: 180 });
        doc.text(paciente.dni || '-', 320, currentY);
        doc.text(paciente.telefono || '-', 420, currentY);
        currentY += 18;

        if (currentY > 700) {
          doc.addPage();
          this.drawHeader(doc, 'NUEVOS PACIENTES');
          currentY = 130;
        }
      });

      doc.fontSize(10).font('Helvetica-Bold').fillColor('#1e293b');
      doc.text(`TOTAL NUEVOS PACIENTES: ${pacientes.length}`, 350, currentY + 10);

      doc.end();
    });
  }

  async generatePresupuestoPdf(presupuesto: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new (PDFDocument as any)({ margin: 50, bufferPages: true });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => {
        this.drawFooter(doc);
        resolve(Buffer.concat(chunks));
      });
      doc.on('error', (err: Error) => reject(err));

      this.drawHeader(doc, 'PRESUPUESTO');

      // Patient Card
      doc.rect(50, 110, 512, 60).fillColor('#f1f5f9').fill();
      doc.fillColor('#1e293b').fontSize(10).font('Helvetica-Bold');
      doc.text('INFORMACIÓN DEL PACIENTE', 60, 120);
      doc.font('Helvetica').fontSize(9);
      doc.text(`Nombre: ${presupuesto.paciente?.nombre || 'N/A'}`, 60, 135);
      doc.text(`DNI: ${presupuesto.paciente?.dni || 'N/A'}`, 60, 148);
      doc.text(`ID Presupuesto: #${presupuesto.id}`, 350, 135);
      doc.text(`Fecha: ${new Date(presupuesto.fecha).toLocaleDateString('es-AR')}`, 350, 148);

      const tableTop = 190;
      doc.fillColor('#334155').fontSize(9).font('Helvetica-Bold');
      doc.text('DESCRIPCIÓN DEL TRATAMIENTO', 50, tableTop);
      doc.text('CANT.', 320, tableTop);
      doc.text('P. UNIT.', 400, tableTop);
      doc.text('SUBTOTAL', 480, tableTop);
      
      doc.moveTo(50, tableTop + 15).lineTo(562, tableTop + 15).strokeColor('#cbd5e1').stroke();

      let currentY = tableTop + 25;
      doc.font('Helvetica').fillColor('#475569').fontSize(8);

      presupuesto.items.forEach((item: any) => {
        const desc = item.descripcion || item.nomenclador?.nombre || 'Tratamiento';
        const sub = item.cantidad * item.precioUnitario;
        
        doc.text(desc, 50, currentY, { width: 260 });
        doc.text(item.cantidad.toString(), 320, currentY);
        doc.text(`$${item.precioUnitario.toLocaleString('es-AR')}`, 400, currentY);
        doc.text(`$${sub.toLocaleString('es-AR')}`, 480, currentY);
        
        // Measure text height to avoid overlap
        const height = doc.heightOfString(desc, { width: 260 });
        currentY += Math.max(20, height + 5);

        if (currentY > 700) {
          doc.addPage();
          this.drawHeader(doc, 'PRESUPUESTO');
          currentY = 130;
        }
      });

      doc.moveTo(400, currentY + 5).lineTo(562, currentY + 5).strokeColor('#e2e8f0').stroke();
      doc.fontSize(12).font('Helvetica-Bold').fillColor('#1e293b');
      doc.text(`TOTAL: $${presupuesto.total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`, 350, currentY + 15, { align: 'right', width: 212 });

      doc.fontSize(8).font('Helvetica-Oblique').fillColor('#64748b').text(
        'Este presupuesto tiene una validez de 15 días corridos a partir de la fecha de emisión.',
        50, 740, { align: 'center' }
      );

      doc.end();
    });
  }
}
