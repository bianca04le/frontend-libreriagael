import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Cliente {
  id?: number;
  documento: string;
  nombres: string;
  telefono: string;
  correo: string;
  direccion: string;
  estado?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  private API = 'http://localhost:3000/api/clientes';

  constructor(private http: HttpClient) {}

  listarClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.API);
  }

  crearCliente(data: Cliente): Observable<any> {
    return this.http.post(this.API, data);
  }

  actualizarCliente(id: number, data: Cliente): Observable<any> {
    return this.http.put(`${this.API}/${id}`, data);
  }

  eliminarCliente(id: number): Observable<any> {
    return this.http.delete(`${this.API}/${id}`);
  }
}