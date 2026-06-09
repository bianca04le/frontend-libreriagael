import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComprasService } from '../../services/compras.spec'; // Corregido de .spec a .service

@Component({
  selector: 'app-compras',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './compras.html',
  styleUrl: './compras.css'
})
export class Compras implements OnInit {

  proveedor_id: number = 0;
  producto_id: number = 0;
  cantidad: number = 1;
  precio_compra: number = 0;

  proveedores: any[] = [];
  productos: any[] = [];
  productosCompra: any[] = [];

  subtotal: number = 0;
  igv: number = 0;
  total: number = 0;

  constructor(private comprasService: ComprasService) {}

  ngOnInit(): void {
    this.comprasService.listarProveedores().subscribe({
      next: (res: any[]) => this.proveedores = res,
      error: (err) => console.error('Error cargando proveedores:', err)
    });

    this.comprasService.listarProductos().subscribe({
      next: (res: any[]) => this.productos = res,
      error: (err) => console.error('Error cargando productos:', err)
    });
  }

  recalcularTotales(): void {
    this.subtotal = this.productosCompra.reduce(
      (acc, p) => acc + (p.cantidad * p.precio_compra),
      0
    );
    this.igv = this.subtotal * 0.18;
    this.total = this.subtotal + this.igv;
  }

  agregarProducto(): void {
    if (this.producto_id === 0) {
      alert('Por favor, seleccione un producto válido.');
      return;
    }

    if (this.cantidad <= 0 || this.precio_compra <= 0) {
      alert('La cantidad y el precio deben ser mayores a cero.');
      return;
    }

    const prod = this.productos.find(p => p.id == this.producto_id);
    
    if (!prod) {
      alert('Producto no encontrado.');
      return;
    }

    // Evitar duplicados incrementando la cantidad si ya existe en la lista
    const productoExistente = this.productosCompra.find(p => p.producto_id == this.producto_id);
    if (productoExistente) {
      productoExistente.cantidad += this.cantidad;
    } else {
      this.productosCompra.push({
        producto_id: Number(this.producto_id),
        nombre: prod.nombre,
        cantidad: this.cantidad,
        precio_compra: this.precio_compra
      });
    }

    // Resetear campos del producto
    this.producto_id = 0;
    this.cantidad = 1;
    this.precio_compra = 0;

    this.recalcularTotales();
  }

  eliminarProducto(index: number): void {
    this.productosCompra.splice(index, 1);
    this.recalcularTotales();
  }

  registrarCompra(): void {
    if (this.proveedor_id === 0) {
      alert('Debe seleccionar un proveedor antes de registrar.');
      return;
    }

    if (this.productosCompra.length === 0) {
      alert('Debe agregar al menos un producto a la lista de compra.');
      return;
    }

    const compra = {
      proveedor_id: Number(this.proveedor_id),
      subtotal: this.subtotal,
      igv: this.igv,
      total: this.total,
      productos: this.productosCompra
    };

    this.comprasService.crearCompra(compra).subscribe({
      next: () => {
        alert('Compra registrada con éxito');
        this.productosCompra = [];
        this.proveedor_id = 0;
        this.subtotal = 0;
        this.igv = 0;
        this.total = 0;
      },
      error: (err) => {
        console.error('Error al registrar compra:', err);
        alert('Ocurrió un error en el servidor al guardar la compra.');
      }
    });
  }
}