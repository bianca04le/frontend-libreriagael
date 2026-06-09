import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Proveedor {
  id?: number;
  ruc: string;
  razon_social: string;
  telefono: string;
  correo: string;
  direccion: string;
  estado?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProveedoresService {

  private API = 'http://localhost:3000/api/proveedores';

  constructor(private http: HttpClient) {}

  listarProveedores(): Observable<Proveedor[]> {
    return this.http.get<Proveedor[]>(this.API);
  }

  crearProveedor(data: Proveedor): Observable<any> {
    return this.http.post(this.API, data);
  }

  actualizarProveedor(
    id: number,
    data: Proveedor
  ): Observable<any> {
    return this.http.put(`${this.API}/${id}`, data);
  }

  eliminarProveedor(id: number): Observable<any> {
    return this.http.delete(`${this.API}/${id}`);
  }
}