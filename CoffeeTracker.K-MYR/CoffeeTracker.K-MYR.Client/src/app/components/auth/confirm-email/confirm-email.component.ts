import { LoadingIndicatorComponent } from '../../shared/loading-indicator/loading-indicator.component';

import { Component } from '@angular/core';

@Component({
  selector: 'app-confirm-email',
  standalone: true,
  imports: [LoadingIndicatorComponent],
  templateUrl: './confirm-email.component.html',
  styleUrl: './confirm-email.component.scss'
})
export class ConfirmEmailComponent {

}
