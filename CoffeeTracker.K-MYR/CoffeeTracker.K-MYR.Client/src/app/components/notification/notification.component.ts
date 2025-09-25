import { Component, computed, inject, linkedSignal, signal, Signal } from '@angular/core';
import { LoadingIndicatorComponent } from '../shared/loading-indicator/loading-indicator.component';
import { NotificationService } from '../../services/notification.service';
import { Message } from '../../interfaces/message';

@Component({
  selector: 'app-notification',
  imports: [ LoadingIndicatorComponent ],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss',
  standalone: true
})
export class NotificationComponent {
  private messageService = inject(NotificationService);
  private numberOfMessages = this.messageService.numberOfMessages;
  IsHidden = computed(() => this.numberOfMessages() === 0);
  messages = this.messageService.userMessages;
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
  iconId = computed(() => this.currentMessage()?.status === 'success' ? '#checkmark' : '#error');
  hasNext = computed(() => this.currentIndex() < (this.numberOfMessages() - 1));
  hasPrevious = computed(() => this.currentIndex() > 0);

  onMouseEnter() {
    this.messageService.setIsUserInteracting(true);
  }

  onMouseLeave() {
    this.messageService.setIsUserInteracting(false);
  }

  previous() {
    this.currentIndex.update(current => Math.max(0, current - 1));
  }

  next() {
    this.currentIndex.update(current => Math.min(this.numberOfMessages() - 1, current + 1));
  }
}
