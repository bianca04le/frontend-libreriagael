import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// 1. IMPORTA AQUÍ TU SERVICIO REAL DE PROVEEDORES
// Ajusta la ruta '../../services/...' según dónde esté guardado tu archivo real
import { ProveedoresService } from '../../services/proveedores.spec'; 

@Component({
  selector: 'app-proveedores',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './proveedores.html',
  styleUrl: './proveedores.css'
})
export class Proveedores implements OnInit {

  proveedores: any[] = [];
  cargando: boolean = false;
  esEditar: boolean = false;

  proveedorActual: any = {
    id: null,
    ruc: '',
    razon_social: '',
    telefono: '',
    correo: '',
    direccion: '',
    estado: true
  };

  // 2. CAMBIA EL 'any' POR LA CLASE REAL DE TU SERVICIO
  constructor(private proveedoresService: ProveedoresService) {}

  ngOnInit(): void {
    this.cargarProveedores();
  }

  cargarProveedores(): void {
    this.cargando = true;
    this.proveedoresService.listarProveedores().subscribe({
      next: (res: any[]) => {
        this.proveedores = res;
        this.cargando = false;
      },
      error: (err: any) => {
        console.error('Error al listar proveedores:', err);
        this.cargando = false;
      }
    });
  }

  guardarProveedor(event: Event): void {
    event.preventDefault();

    if (this.esEditar) {
      this.proveedoresService.actualizarProveedor(this.proveedorActual.id, this.proveedorActual).subscribe({
        next: () => {
          this.limpiarFormulario();
          this.cargarProveedores();
        },
        error: (err: any) => console.error(err)
      });
    } else {
      this.proveedoresService.crearProveedor(this.proveedorActual).subscribe({
        next: () => {
          this.limpiarFormulario();
          this.cargarProveedores();
        },
        error: (err: any) => console.error(err)
      });
    }
  }

  seleccionarProveedor(prov: any): void {
    this.esEditar = true;
    this.proveedorActual = { ...prov };
  }

  eliminar(id: number): void {
    if (confirm('¿Estás seguro de eliminar este proveedor?')) {
      this.proveedoresService.eliminarProveedor(id).subscribe({
        next: () => {
          this.cargarProveedores();
        },
        error: (err: any) => console.error(err)
      });
    }
  }

  limpiarFormulario(): void {
    this.esEditar = false;
    this.proveedorActual = {
      id: null,
      ruc: '',
      razon_social: '',
      telefono: '',
      correo: '',
      direccion: '',
      estado: true
    };
  }
}