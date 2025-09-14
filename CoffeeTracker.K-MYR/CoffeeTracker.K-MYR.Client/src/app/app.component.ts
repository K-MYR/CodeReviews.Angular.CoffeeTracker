import { NavbarComponent } from '../app/components/navbar/navbar.component';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificationComponent } from './components/notification/notification.component';
import { SvgSpriteSheetComponent } from './components/svg-sprite-sheet/svg-sprite-sheet.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ NavbarComponent, RouterOutlet, NotificationComponent, SvgSpriteSheetComponent ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'CoffeeTracker';
}
