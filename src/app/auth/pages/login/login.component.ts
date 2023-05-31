import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  private formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  public form: FormGroup = this.formBuilder.group({
    email: ['Consuelo.Luettgen@yahoo.com', [Validators.required, Validators.email]],
    password: ['12345123123', [Validators.required, Validators.minLength(6)]],
  });

  public login() {
    this.authService.login(this.form.value?.email, this.form.value?.password).subscribe({
      next: async (_) => {
        await this.router.navigateByUrl('/dashboard');
      },
      error: async (message) => {
        await Swal.fire('Login', message, 'error');
      },
    });
  }
}
