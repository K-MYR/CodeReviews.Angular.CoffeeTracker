import { computed, Injectable, signal } from '@angular/core';
import { Message } from '../interfaces/message';
import { Status } from '../interfaces/status';
import { timestamp } from 'rxjs';
import { time } from 'node:console';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private messages = signal<Message[]>([]);
  userMessages = this.messages.asReadonly();
  numberOfMessages = computed(() => this.messages().length);
  private timer: NodeJS.Timeout | null = null;
  private readonly _timerInterval: number = 2000;
  private readonly _messageLifetime: number = 3000;
  private isUserInteracting: boolean = false;

  addMessage(text: string, status: Status): string {
    const id = crypto.randomUUID();
    const newMessage = {
      id: id,
      text: text,
      status: status,
      timestamp: new Date
    };

    this.messages.update(state => [...state, newMessage]);
    this.startTimer();
    return id;
  }      

  updateMessage(id: string, changes: Partial<Message>) {
    this.messages.update(state =>
      state.map(msg =>
        msg.id === id ? { ...msg, ...changes, timestamp: new Date() } : msg)
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
    if (this.isUserInteracting) {
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
    const timePassed = Date.now() - oldestMessage.timestamp.getTime();
    if (timePassed < this._messageLifetime) {
      return;
    }
    
    this.removeMessage(oldestMessage.id);
  }

  private startTimer() {
    if (this.timer !== null) {
      return;
    }
    this.timer = setInterval(() => this.checkMessages(), this._timerInterval)
  }

  private stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }  
}
