import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { VentasService } from '../../services/ventas.spec';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  fechaActual: Date = new Date();

  totalVentas: number = 0;
  totalCompras: number = 0;
  totalProveedores: number = 0;
  totalProductosStock: number = 0;
  itemsCriticos: number = 0;

  ultimasTransacciones: any[] = [];
  inventarioCritico: any[] = [];

  constructor(
    private router: Router,
    private ventasService: VentasService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Reloj operativo en la cabecera
    setInterval(() => { this.fechaActual = new Date(); }, 60000);
    this.cargarResumenReal();
  }

  cargarResumenReal(): void {
    this.ventasService.obtenerResumenDashboard().subscribe({
      next: (res) => {
        this.totalVentas = res.ventas_hoy;
        this.totalCompras = res.compras_hoy;
        this.totalProveedores = res.total_proveedores;
        this.totalProductosStock = res.total_stock;
        
        this.ultimasTransacciones = res.ultimas_transacciones;
        this.inventarioCritico = res.inventario_critico;
        this.itemsCriticos = this.inventarioCritico.length;

        this.cdr.detectChanges(); // Renderiza de inmediato la data de Postgres
      },
      error: (err) => {
        console.error('❌ Error al cargar métricas del Dashboard:', err);
      }
    });
  }

  irA(ruta: string): void {
    this.router.navigate([`/${ruta}`]);
  }
}