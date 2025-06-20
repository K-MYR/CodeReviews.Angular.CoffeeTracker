import { PercentPipe } from '@angular/common';
import { Component, input } from '@angular/core';

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

export interface LoadingIndicatorTextPath {
  text: string,
  startOffset: number,
  id: string,
}
