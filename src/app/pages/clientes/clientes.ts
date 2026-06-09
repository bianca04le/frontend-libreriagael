import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  ClientesService,
  Cliente
} from '../../services/clientes.spec';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css'
})
export class Clientes implements OnInit {

  modalAbierto = false;
  editando = false;

  clientes: Cliente[] = [];

  cliente: Cliente = {
    documento: '',
    nombres: '',
    telefono: '',
    correo: '',
    direccion: ''
  };

  constructor(
    private clientesService: ClientesService
  ) {}

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes(): void {

    this.clientesService
      .listarClientes()
      .subscribe({

        next: (res: Cliente[]) => {
          this.clientes = res;
        },

        error: (err: any) => {
          console.error(err);
        }

      });

  }

  abrirModal(): void {

    this.modalAbierto = true;
    this.editando = false;

    this.limpiar();

  }

  cerrarModal(): void {

    this.modalAbierto = false;

    this.limpiar();

  }

  guardarCliente(): void {

    if (this.editando && this.cliente.id) {

      this.clientesService
        .actualizarCliente(
          this.cliente.id,
          this.cliente
        )
        .subscribe({

          next: () => {

            this.cargarClientes();
            this.cerrarModal();

          },

          error: (err: any) => {
            console.error(err);
          }

        });

      return;
    }

    this.clientesService
      .crearCliente(this.cliente)
      .subscribe({

        next: () => {

          this.cargarClientes();
          this.cerrarModal();

        },

        error: (err: any) => {
          console.error(err);
        }

      });

  }

  editarCliente(cliente: Cliente): void {

    this.cliente = { ...cliente };

    this.modalAbierto = true;
    this.editando = true;

  }

  eliminarCliente(id?: number): void {

    if (!id) return;

    if (!confirm('¿Eliminar cliente?')) return;

    this.clientesService
      .eliminarCliente(id)
      .subscribe({

        next: () => {
          this.cargarClientes();
        },

        error: (err: any) => {
          console.error(err);
        }

      });

  }

  limpiar(): void {

    this.cliente = {
      documento: '',
      nombres: '',
      telefono: '',
      correo: '',
      direccion: ''
    };

  }

}