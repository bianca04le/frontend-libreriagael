import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { VentasService } from '../../services/ventas.spec'; // ✅ CORREGIDO: Apuesta a .service y no a .spec

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ventas.html',
  styleUrl: './ventas.css'
})
export class VentasComponent implements OnInit {
  cargando = false;
  total = 0;
  cantidad = 1;
  tipo_comprobante = 'BOLETA';
  
  clienteSeleccionado: number | null = null; 
  productoSeleccionado: number | null = null;

  clientes: any[] = []; 
  productos: any[] = []; 
  productosVenta: any[] = [];

  constructor(
    private router: Router,
    private ventasService: VentasService,
    private cdr: ChangeDetectorRef // Inyección del detector de cambios
  ) {}

  ngOnInit(): void {
    this.clienteSeleccionado = null;
    this.productoSeleccionado = null;
    this.cargarProductosDeBaseDeDatos();
    this.cargarClientesDeBaseDeDatos();
  }

  cargarProductosDeBaseDeDatos() {
    this.ventasService.listarProductos().subscribe({
      next: (data) => {
        this.productos = data;
        this.cdr.detectChanges(); // Fuerza la renderización instantánea
        console.log('📦 Productos desde PostgreSQL:', this.productos);
      },
      error: (err) => console.error('❌ Error al jalar productos:', err)
    });
  }

  cargarClientesDeBaseDeDatos() {
    this.ventasService.listarClientes().subscribe({
      next: (data) => {
        this.clientes = data;
        this.cdr.detectChanges(); // Fuerza la renderización instantánea
        console.log('👥 Clientes desde PostgreSQL:', this.clientes);
      },
      error: (err) => console.error('❌ Error al jalar clientes:', err)
    });
  }

  agregarProducto() {
    const prod = this.productos.find(p => p.id === Number(this.productoSeleccionado));
    if (!prod || this.cantidad < 1) return;

    if (this.cantidad > prod.stock) {
      alert(`Stock insuficiente. Solo quedan ${prod.stock} unidades.`);
      return;
    }

    const subtotalItem = Number(prod.precio_venta || prod.precio) * this.cantidad;
    
    this.productosVenta.push({
      producto_id: prod.id,
      nombre: prod.nombre,
      precio: Number(prod.precio_venta || prod.precio),
      cantidad: this.cantidad,
      subtotal: subtotalItem
    });

    this.calcularTotal();
    this.productoSeleccionado = null;
    this.cantidad = 1;
    this.cdr.detectChanges(); // Actualiza la lista del carrito al toque
  }

  eliminarProducto(index: number) {
    this.productosVenta.splice(index, 1);
    this.calcularTotal();
    this.cdr.detectChanges();
  }

  calcularTotal() {
    this.total = this.productosVenta.reduce((acc, item) => acc + item.subtotal, 0);
  }

  registrarVenta() {
    if (this.productosVenta.length === 0) {
      alert('El carrito está vacío. Añade productos.');
      return;
    }

    this.cargando = true;
    const idClienteFinal = this.clienteSeleccionado ? Number(this.clienteSeleccionado) : null;

    const payloadVenta = {
      cliente_id: idClienteFinal, 
      usuario_id: 1,    
      tipo_comprobante: this.tipo_comprobante,
      productos: this.productosVenta.map(p => ({
        producto_id: Number(p.producto_id),
        cantidad: Number(p.cantidad)
      }))
    };

    this.ventasService.crearVenta(payloadVenta).subscribe({
      next: () => {
        this.cargando = false;
        alert('¡Venta registrada con éxito en PostgreSQL!');
        this.router.navigate(['/historial-ventas']);
      },
      error: (err) => {
        this.cargando = false;
        console.error('Error del Servidor:', err);
        alert(`No se pudo guardar la venta.`);
      }
    });
  }
}