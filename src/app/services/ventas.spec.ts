import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VentasService {
  private apiUrl = 'http://localhost:3000/api/ventas';
  private prodUrl = 'http://localhost:3000/api/productos';
  private clientUrl = 'http://localhost:3000/api/clientes'; // <-- Ruta para tus clientes en Express

  constructor(private http: HttpClient) {}

  listarVentas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  listarProductos(): Observable<any[]> {
    return this.http.get<any[]>(this.prodUrl);
  }

  listarClientes(): Observable<any[]> {
    return this.http.get<any[]>(this.clientUrl);
  }

  obtenerDetalleVenta(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  crearVenta(venta: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, venta);
  }
  obtenerResumenDashboard(): Observable<any> {
  return this.http.get<any>('http://localhost:3000/api/dashboard');
}
}