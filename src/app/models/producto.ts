export interface Producto {
  id: number;
  codigo_barra: string;
  nombre: string;
  descripcion: string;
  categoria_id: number;
  precio_compra: number;
  precio_venta: number;
  stock: number;
}