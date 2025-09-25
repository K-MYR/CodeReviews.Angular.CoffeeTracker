import { computed, Injectable, signal } from '@angular/core';
import { Message } from '../interfaces/message';
import { Status } from '../interfaces/status';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private messages = signal<Message[]>([]);
  userMessages = this.messages.asReadonly();
  numberOfMessages = computed(() => this.messages().length);
  private timer: NodeJS.Timeout | null = null;
  private timerInterval: number = 1000;
  private isUserInteracting: boolean = false;

  addMessage(text: string, status: Status): string {
    const id = crypto.randomUUID();
    const newMessage = {
      id: id,
      text: text,
      status: status
    };

    this.messages.update(state => [...state, newMessage]);
    this.startTimer();
    return id;
  }      

  updateMessage(id: string, changes: Partial<Message>) {
    this.messages.update(state =>
      state.map(msg =>
        msg.id === id ? { ...msg, ...changes } : msg)
    );
  }

  removeMessage(id: string) {
    this.messages.update(state =>
      state.filter(msg =>
        msg.id !== id
      )
    );
  }

  setIsUserInteracting(isUserInteracting: boolean): void {
    this.isUserInteracting = isUserInteracting;
  }

  private checkMessages() {
    if (!this.isUserInteracting) {
      return;
    }
    const messages = this.userMessages();
    if (messages.length === 0) {
      this.stopTimer();
      return;
    }
    const oldestMessage = messages[0];
    if (oldestMessage.status === 'loading') {
      return;
    }
    this.removeMessage(oldestMessage.id);

  }

  private startTimer() {
    if (this.timer) {
      return;
    }
    this.timer = setInterval(() => this.checkMessages(), this.timerInterval)
  }

  private stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }  
}
