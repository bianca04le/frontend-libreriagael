import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductosService, Producto } from '../../services/productos.spec'; // ✅ Corregido de .spec a .service

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './productos.html',
  styleUrl: './productos.css',
})
export class Productos implements OnInit {

  modalAbierto = false;
  editando = false;

  producto: Producto = {
    codigo_barra: '',
    nombre: '',
    descripcion: '',
    marca: '',
    precio_compra: 0,
    precio_venta: 0,
    stock: 0
  };

  productos: Producto[] = [];

  constructor(
    private productosService: ProductosService,
    private cdr: ChangeDetectorRef // 🔥 Inyectado para actualizar el inventario al toque
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  // LISTAR
  cargarProductos(): void {
    this.productosService.listarProductos().subscribe({
      next: (res: Producto[]) => {
        this.productos = res;
        this.cdr.detectChanges(); // 🔥 Fuerza el repintado inmediato en la tabla
      },
      error: (err: any) => console.error('❌ Error al listar productos:', err)
    });
  }

  // ABRIR MODAL
  abrirModal(): void {
    this.modalAbierto = true;
    this.editando = false;
    this.limpiar();
    this.cdr.detectChanges();
  }

  cerrarModal(): void {
    this.modalAbierto = false;
    this.limpiar();
    this.cdr.detectChanges();
  }

  // GUARDAR / ACTUALIZAR
  guardarProducto(): void {
    if (this.editando && this.producto.id) {
      this.productosService.actualizarProducto(this.producto.id, this.producto)
        .subscribe({
          next: () => {
            this.cargarProductos();
            this.cerrarModal();
          },
          error: (err: any) => console.error('❌ Error al actualizar:', err)
        });
      return;
    }

    this.productosService.crearProducto(this.producto)
      .subscribe({
        next: () => {
          this.cargarProductos();
          this.cerrarModal();
        },
        error: (err: any) => console.error('❌ Error al guardar:', err)
      });
  }

  // EDITAR
  editarProducto(p: Producto): void {
    this.producto = { ...p };
    this.modalAbierto = true;
    this.editando = true;
    this.cdr.detectChanges();
  }

  // ELIMINAR
  eliminarProducto(id?: number): void {
    if (!id) return;
    if (!confirm('¿Estás seguro de eliminar este producto del inventario?')) return;

    this.productosService.eliminarProducto(id)
      .subscribe({
        next: () => {
          this.cargarProductos();
        },
        error: (err: any) => console.error('❌ Error al eliminar:', err)
      });
  }

  // LIMPIAR
  limpiar(): void {
    this.producto = {
      codigo_barra: '',
      nombre: '',
      descripcion: '',
      marca: '',
      precio_compra: 0,
      precio_venta: 0,
      stock: 0
    };
  }
}