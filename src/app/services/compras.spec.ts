import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComprasService {

  private API = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  crearCompra(data: any): Observable<any> {
    return this.http.post(`${this.API}/compras`, data);
  }

  listarCompras(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API}/compras`);
  }

  listarProductos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API}/productos`);
  }

  listarProveedores(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API}/proveedores`);
  }
}