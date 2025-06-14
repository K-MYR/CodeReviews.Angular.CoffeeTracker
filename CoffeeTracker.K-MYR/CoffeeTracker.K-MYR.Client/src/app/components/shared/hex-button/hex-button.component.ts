import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hex-button',
  imports: [ RouterLink,],
  templateUrl: './hex-button.component.html',
  styleUrl: './hex-button.component.scss',
  standalone: true,
})
export class HexButtonComponent {
  text = input.required<string>();
  routerLink = input.required<string>();
}
