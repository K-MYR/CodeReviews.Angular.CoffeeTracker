import { AuthService } from '../../../services/auth.service';
import { PostRegister, PostRegisterForm } from '../../../interfaces/post-register';
import { identicalValueValidator, nonidenticalValueErrorKey } from '../../../validators/same-value.validator';
import { HexButtonComponent } from '../../shared/hex-button/hex-button.component';

import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Component, inject } from '@angular/core';
import { Router, } from '@angular/router';
import { HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, HexButtonComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router: Router = inject(Router);
  nonidenticalValueErrorKey = nonidenticalValueErrorKey;
  registerForm = new FormGroup<PostRegisterForm>({
    email: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    confirmPassword: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] })
  }, { validators: identicalValueValidator('password', 'confirmPassword') });

  register(): void {
    var data = this.registerForm.value;
    var credentials: PostRegister = {
      email: data.email ?? '',
      password: data.password ?? ''
    };
    if (data.email && data.password) {
      this.authService.register(credentials)
        .subscribe(response => {
          if (response.status === HttpStatusCode.Ok) {
            this.router.navigateByUrl("/auth/register-success");
          }
        });
    }
  }
}
