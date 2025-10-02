import { Component, computed, inject, linkedSignal } from '@angular/core';
import { LoadingIndicatorComponent } from '../shared/loading-indicator/loading-indicator.component';
import { NotificationService } from '../../services/notification.service';
import { Message } from '../../interfaces/message';
import { Status } from '../../interfaces/status';

@Component({
  selector: 'app-notification',
  imports: [ LoadingIndicatorComponent ],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss',
  standalone: true
})
export class NotificationComponent {
  private readonly _messageService = inject(NotificationService);
  private numberOfMessages = this._messageService.numberOfMessages;
  IsHidden = computed(() => this.numberOfMessages() === 0);
  messages = this._messageService.userMessages;
  currentIndex = linkedSignal<Message[], number>({
    source: this.messages,
    computation: (newSource, previous) => previous?.value
      ? Math.min(previous.value, newSource.length - 1)
      : 0
  });
  currentMessage = computed(() => this.numberOfMessages() > 0
    ? this.messages()[this.currentIndex()]
    : null
  );
  iconId = computed(() => {
    const message = this.currentMessage();
    if (!message) {
      return '#coffee-cup';
    }

    if (message.status === 'static' && message.iconId) {
      return message.iconId;
    }

    return statusMap[message.status] ?? '#coffee-cup';
  });
  
  hasNext = computed(() => this.currentIndex() < (this.numberOfMessages() - 1));
  hasPrevious = computed(() => this.currentIndex() > 0);

  onMouseEnter() {
    this._messageService.setIsUserInteracting(true);
  }

  onMouseLeave() {
    this._messageService.setIsUserInteracting(false);
  }

  previous() {
    this.currentIndex.update(current => Math.max(0, current - 1));
  }

  next() {
    this.currentIndex.update(current => Math.min(this.numberOfMessages() - 1, current + 1));
  }  
}

const statusMap: Record<string, string> = {
  error: '#error',
  success: '#checkmark'
};
