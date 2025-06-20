import { NavbarComponent } from '../app/components/navbar/navbar.component';

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ NavbarComponent, RouterOutlet ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'CoffeeTracker';
}
