import { Component } from '@angular/core';
import { NavbarComponent } from '../app/components/navbar/navbar.component';
import { RecordsTableComponent } from '../app/components/records-table/records-table.component'
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ NavbarComponent, RecordsTableComponent, RouterOutlet, RouterLinkActive, RouterLink, ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'CoffeeTracker.K-MYR.Client';
}
