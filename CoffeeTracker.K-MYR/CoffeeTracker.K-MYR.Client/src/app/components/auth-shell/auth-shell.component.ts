import { BackgroundComponent } from '../background/background.component';

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-shell',
  standalone: true,
  imports: [ RouterOutlet, BackgroundComponent, ],
  templateUrl: './auth-shell.component.html',
  styleUrl: './auth-shell.component.scss'
})
export class AuthShellComponent {

}
