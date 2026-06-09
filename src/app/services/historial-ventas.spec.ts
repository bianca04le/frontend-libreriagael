import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Venta {
  id: number;
  fecha: string;
  cliente: string;
  tipo_comprobante: string;
  subtotal: number;
  igv: number;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class HistorialVentasService {

  private API = 'http://localhost:3000/api/ventas';

  constructor(
    private http: HttpClient
  ) {}

  listarVentas(): Observable<Venta[]> {
    return this.http.get<Venta[]>(this.API);
  }

  obtenerDetalle(id: number): Observable<any> {
    return this.http.get<any>(
      `${this.API}/${id}`
    );
  }

}