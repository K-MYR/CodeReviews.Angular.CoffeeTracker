import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { PostRegister, PostRegisterForm } from '../../interfaces/post-register';

import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private authService = inject(AuthService);
  registerForm = new FormGroup<PostRegisterForm>({
    email: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] })
  });

  register(): void {
    var data = this.registerForm.value;
    var credentials: PostRegister = {
      email: data.email ?? '',
      password: data.password ?? ''
    };
    if (data.email && data.password) {
      this.authService.register(credentials)
        .subscribe(_ => console.log('Sign up successful'));
    }
  }
}
