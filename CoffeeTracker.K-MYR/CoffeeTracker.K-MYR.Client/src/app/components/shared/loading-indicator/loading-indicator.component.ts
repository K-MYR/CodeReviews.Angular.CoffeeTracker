import { PercentPipe } from '@angular/common';
import { Component, input } from '@angular/core';

export interface LoadingIndicatorTextPath {
  text: string,
  startOffset: number,
  id: string,
}

@Component({
  selector: 'app-loading-indicator',
  standalone: true,
  imports: [PercentPipe],
  templateUrl: './loading-indicator.component.html',
  styleUrl: './loading-indicator.component.scss'
})
export class LoadingIndicatorComponent {
  paths = input<LoadingIndicatorTextPath[]>([]);
}
