import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { PostLogin, PostLoginForm } from '../../../interfaces/post-login';

import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  loginForm = new FormGroup<PostLoginForm>({
    email: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] })
  });

  login(): void {
    var data = this.loginForm.value;
    var credentials: PostLogin = {
      email: data.email ?? '',
      password: data.password ?? ''
    };
    if (data.email && data.password) {
      this.authService.login(credentials)
        .subscribe(_ => this.router.navigateByUrl("/"));
    }
  }
}
