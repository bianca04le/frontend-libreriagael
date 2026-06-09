import { Routes } from '@angular/router';

import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { Productos } from './pages/productos/productos';
import { Clientes } from './pages/clientes/clientes';
import { Proveedores } from './pages/proveedores/proveedores';
import { VentasComponent } from './pages/ventas/ventas'; // <-- CORREGIDO
import { Compras } from './pages/compras/compras';
import { HistorialVentasComponent } from './pages/historial-ventas/historial-ventas'; // <-- CORREGIDO

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    component: Login
  },

  {
    path: 'dashboard',
    component: Dashboard
  },

  {
    path: 'productos',
    component: Productos
  },

  {
    path: 'clientes',
    component: Clientes
  },

  {
    path: 'proveedores',
    component: Proveedores
  },

  {
    path: 'ventas',
    component: VentasComponent // <-- CORREGIDO
  },

  {
    path: 'historial-ventas',
    component: HistorialVentasComponent // <-- CORREGIDO
  },

  { 
    path: 'compras',
    component: Compras
  }
];