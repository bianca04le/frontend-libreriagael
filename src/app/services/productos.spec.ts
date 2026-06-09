import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Producto {
  id?: number;
  codigo_barra?: string;
  nombre: string;
  descripcion: string;
  marca: string;
  precio_compra: number;
  precio_venta: number;
  stock: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  private API = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  listarProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.API}/productos`);
  }

  crearProducto(data: Producto): Observable<Producto> {
    return this.http.post<Producto>(`${this.API}/productos`, data);
  }

  eliminarProducto(id: number): Observable<any> {
    return this.http.delete(`${this.API}/productos/${id}`);
  }

  actualizarProducto(id: number, data: Producto): Observable<Producto> {
    return this.http.put<Producto>(`${this.API}/productos/${id}`, data);
  }

  // 🔥 POS - BUSCAR POR CÓDIGO DE BARRAS
  buscarPorCodigo(codigo: string): Observable<Producto> {
    return this.http.get<Producto>(`${this.API}/productos/codigo/${codigo}`);
  }
}