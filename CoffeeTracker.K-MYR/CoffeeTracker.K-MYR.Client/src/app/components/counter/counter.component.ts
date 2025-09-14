import { DecimalPipe } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-counter',
  standalone: true,
  imports: [ DecimalPipe ],
  templateUrl: './counter.component.html',
  styleUrl: './counter.component.scss'
})
export class CounterComponent {
  counter = input.required<number>();
  title = input.required<string>();
}
