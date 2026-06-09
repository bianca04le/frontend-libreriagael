import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  usuario = '';
  clave = '';

  private authService = inject(AuthService);
  private router = inject(Router);

  ingresar() {

    this.authService.login(
      this.usuario,
      this.clave
    ).subscribe({

      next: (resp: any) => {

        localStorage.setItem(
          'token',
          resp.token
        );

        this.router.navigate(['/dashboard']);
      },

      error: () => {

        alert(
          'Usuario o contraseña incorrectos'
        );
      }
    });
  }
}