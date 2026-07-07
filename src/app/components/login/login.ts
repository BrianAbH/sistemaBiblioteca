import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
})
export class Login {

  formLogin!: FormGroup;
  error: string | null = null;

  constructor(private router: Router, public auth: AuthService, private fb: FormBuilder) {
    /* Formulario de inicio de sesión */
    this.formLogin = this.fb.group({
      Correo: ['', [Validators.required]],
      Password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if(this.formLogin.invalid){
      this.formLogin.markAllAsTouched();
      return;
    }
    if (this.formLogin.valid) {
      const { Correo, Password } = this.formLogin.value;

      this.auth.login(Correo, Password).subscribe({
        next: res => {
          this.auth.saveToken(res.token);
          alert('Inicio de sesión exitoso');
          this.router.navigate(['/menu-vista']);
          
        },
        error: () => {
          this.error = 'Credenciales inválidas';
        }
      });
    }
  }


  showPassword(): void {
    const passwordInput = document.getElementById('password') as HTMLInputElement;  
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
    } else {
      passwordInput.type = 'password';
    }
  }

}
