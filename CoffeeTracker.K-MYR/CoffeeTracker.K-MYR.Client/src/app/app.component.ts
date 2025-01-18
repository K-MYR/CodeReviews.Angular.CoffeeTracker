import { Component } from '@angular/core';
import { NavbarComponent } from '../app/components/navbar/navbar.component';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ NavbarComponent, RouterOutlet, RouterLinkActive, RouterLink, ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'CoffeeTracker.K-MYR.Client';
}
