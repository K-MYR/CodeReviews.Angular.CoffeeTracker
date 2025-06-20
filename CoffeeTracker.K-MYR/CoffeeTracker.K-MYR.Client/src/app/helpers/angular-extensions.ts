import { Observable } from "rxjs";

export function resizeObserverToObserverable(element: HTMLElement): Observable<ResizeObserverEntry[]> {
  return new Observable<ResizeObserverEntry[]>((subscriber) => {
    var resizeObserver = new ResizeObserver(entries => {
      subscriber.next(entries);
    });
    resizeObserver.observe(element);
    return () => {
      resizeObserver.disconnect();
    }
  });
}
