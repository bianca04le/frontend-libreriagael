import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ProductosService {

  private http = inject(HttpClient);
  private api = 'http://localhost:3000/api/productos';

  listar() {
    return this.http.get<any[]>(this.api);
  }

  obtener(id: number) {
    return this.http.get<any>(`${this.api}/${id}`);
  }

  crear(data: any) {
    return this.http.post<any>(this.api, data);
  }

  actualizar(id: number, data: any) {
    return this.http.put<any>(`${this.api}/${id}`, data);
  }

  eliminar(id: number) {
    return this.http.delete<any>(`${this.api}/${id}`);
  }

  buscarPorCodigo(codigo: string) {
    return this.http.get<any>(`${this.api}/barcode/${codigo}`);
  }
}