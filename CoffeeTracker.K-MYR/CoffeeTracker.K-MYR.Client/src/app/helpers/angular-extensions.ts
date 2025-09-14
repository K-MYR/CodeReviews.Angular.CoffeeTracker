import { first, Observable, tap } from "rxjs";
import { NotificationService } from "../services/notification.service";

export function resizeObserverToObserverable(element: HTMLElement): Observable<ResizeObserverEntry[]> {
  return new Observable<ResizeObserverEntry[]>((subscriber) => {
    const resizeObserver = new ResizeObserver(entries => {
      subscriber.next(entries);
    });
    resizeObserver.observe(element);
    return () => {
      resizeObserver.disconnect();
    }
  });
}

export function withMessage<T>(
  service: NotificationService,
  loadingText: string,
  successText: string,
  errorText: string,
) {
  return (source$: Observable<T>): Observable<T> => {
    const id = service.addMessage(loadingText, 'loading');
    return source$.pipe(
      tap({        
        next: () => service.updateMessage(id, { text: successText, status: 'success' }),
        error: () => service.updateMessage(id, { text: errorText, status: 'error' }),
      })
    )
  }
}
