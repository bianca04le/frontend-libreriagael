import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { VentasService } from '../../services/ventas.spec';

@Component({
  selector: 'app-historial-ventas',
  standalone: true,
  imports: [CommonModule, RouterModule],
  providers: [DatePipe],
  templateUrl: './historial-ventas.html',
  styleUrl: './historial-ventas.css'
})
export class HistorialVentasComponent implements OnInit {
  ventas: any[] = [];

  constructor(
    private ventasService: VentasService,
    private cdr: ChangeDetectorRef,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.cargarHistorial();
  }

  cargarHistorial() {
    this.ventasService.listarVentas().subscribe({
      next: (data) => {
        this.ventas = data;
        this.cdr.detectChanges();
        console.log('📋 Historial de ventas cargado:', this.ventas);
      },
      error: (err) => console.error('❌ Error al obtener el historial:', err)
    });
  }

  imprimirTicket(venta: any) {
    this.ventasService.obtenerDetalleVenta(venta.id).subscribe({
      next: (detalles) => {
        this.generarFormatoTicket(venta, detalles);
      },
      error: (err) => {
        console.error('❌ Error al conseguir el detalle para el ticket:', err);
        alert('No se pudo cargar el detalle de los artículos.');
      }
    });
  }

  generarFormatoTicket(venta: any, detalles: any[]) {
    const fechaFormateada = this.datePipe.transform(venta.fecha, 'dd/MM/yyyy') || '';
    const horaFormateada = this.datePipe.transform(venta.fecha, 'HH:mm:ss a') || '';
    
    const ventanaImpresion = window.open('', '_blank', 'width=320,height=700');
    if (!ventanaImpresion) {
      alert('Por favor, permite las ventanas emergentes (pop-ups) para imprimir.');
      return;
    }

    let filasProductos = '';
    detalles.forEach(d => {
      filasProductos += `
        <tr class="item-row">
          <td class="text-left font-medium" style="max-width: 140px; word-break: break-word;">${d.producto}</td>
          <td class="text-center">${d.cantidad}</td>
          <td class="text-right">S/ ${Number(d.precio).toFixed(2)}</td>
          <td class="text-right font-semibold">S/ ${Number(d.subtotal).toFixed(2)}</td>
        </tr>
      `;
    });

    ventanaImpresion.document.write(`
      <html>
        <head>
          <title>Ticket_${venta.id}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
            @page { margin: 0; }
            
            body {
              font-family: 'Inter', system-ui, -apple-system, sans-serif;
              width: 280px;
              margin: 0 auto;
              padding: 16px 10px;
              color: #111827;
              background-color: #ffffff;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }

            .text-center { text-align: center; }
            .text-left { text-align: left; }
            .text-right { text-align: right; }
            .font-medium { font-weight: 500; }
            .font-semibold { font-weight: 600; }
            .font-bold { font-weight: 700; }
            
            .brand-header {
              margin-bottom: 16px;
            }
            .brand-name {
              font-size: 18px;
              font-weight: 700;
              letter-spacing: -0.025em;
              text-transform: uppercase;
              margin: 0 0 2px 0;
            }
            .brand-subtitle {
              font-size: 10px;
              color: #6b7280;
              line-height: 1.4;
            }

            .divider-solid {
              border-top: 1px solid #111827;
              margin: 10px 0;
            }
            .divider-dashed {
              border-top: 1px dashed #9ca3af;
              margin: 12px 0;
            }

            .receipt-title {
              font-size: 13px;
              font-weight: 700;
              letter-spacing: 0.05em;
              margin: 4px 0 10px 0;
            }

            .info-grid {
              font-size: 11px;
              line-height: 1.5;
              color: #374151;
              margin-bottom: 8px;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
            }

            .products-table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 8px;
            }
            .products-table th {
              font-size: 10px;
              font-weight: 700;
              color: #111827;
              padding-bottom: 6px;
              border-bottom: 1px solid #111827;
            }
            .item-row td {
              font-size: 11px;
              color: #111827;
              padding: 6px 0;
              vertical-align: top;
            }

            .totals-table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 4px;
            }
            .totals-table td {
              font-size: 11px;
              padding: 3px 0;
              color: #374151;
            }
            .totals-table .grand-total td {
              font-size: 14px;
              color: #111827;
              padding-top: 6px;
            }

            .footer-section {
              margin-top: 20px;
              font-size: 10px;
              color: #6b7280;
              line-height: 1.5;
            }
            
            /* Simulación de código QR moderno estilizado con CSS block */
            .qr-mock {
              width: 70px;
              height: 70px;
              margin: 14px auto;
              background: repeating-linear-gradient(45deg, #111827, #111827 4px, #fff 4px, #fff 8px);
              border: 3px solid #111827;
              border-radius: 4px;
            }
          </style>
        </head>
        <body>
          <div class="text-center brand-header">
            <h1 class="brand-name">📚 Librería Gael</h1>
            <div class="brand-subtitle">
              Ventanilla, Callao - Perú<br>
              Telf: (01) 456-7890
            </div>
          </div>
          
          <div class="divider-solid"></div>
          
          <div class="text-center receipt-title">${venta.tipo_comprobante} DE VENTA</div>
          
          <div class="info-grid">
            <div class="info-row">
              <span><strong>N° COMPROBANTE:</strong> #00${venta.id}</span>
            </div>
            <div class="info-row">
              <span><strong>FECHA:</strong> ${fechaFormateada}</span>
              <span><strong>HORA:</strong> ${horaFormateada}</span>
            </div>
            <div class="info-row" style="margin-top: 2px;">
              <span><strong>CLIENTE:</strong> ${venta.cliente || 'Público General'}</span>
            </div>
          </div>
          
          <table class="products-table">
            <thead>
              <tr>
                <th class="text-left">ITEM</th>
                <th class="text-center" style="width: 35px;">CANT.</th>
                <th class="text-right" style="width: 55px;">P. UNIT</th>
                <th class="text-right" style="width: 60px;">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              ${filasProductos}
            </tbody>
          </table>
          
          <div class="divider-dashed"></div>
          
          <table class="totals-table">
            <tr>
              <td>OP. GRAVADA</td>
              <td class="text-right">S/ ${Number(venta.subtotal).toFixed(2)}</td>
            </tr>
            <tr>
              <td>I.G.V. (18%)</td>
              <td class="text-right">S/ ${Number(venta.igv).toFixed(2)}</td>
            </tr>
            <tr class="grand-total font-bold">
              <td>TOTAL A PAGAR (S/.)</td>
              <td class="text-right">S/ ${Number(venta.total).toFixed(2)}</td>
            </tr>
          </table>
          
          <div class="divider-solid"></div>
          
          <div class="text-center footer-section">
            <div class="qr-mock"></div>
            <span class="font-semibold" style="color: #111827;">¡GRACIAS POR SU COMPRA!</span><br>
            <span>Vuelva pronto | libreriagael.pe</span>
          </div>

          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);

    ventanaImpresion.document.close();
  }
}