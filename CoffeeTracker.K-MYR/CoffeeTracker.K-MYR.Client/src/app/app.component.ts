import { NavbarComponent } from '../app/components/navbar/navbar.component';
import { BackgroundComponent } from './components/background/background.component';

import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ NavbarComponent, RouterOutlet, RouterLinkActive, RouterLink, BackgroundComponent ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'CoffeeTracker.K-MYR.Client';
}
