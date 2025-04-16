import { Observable } from "rxjs";

export function resizeObserverToObserverable(element: HTMLElement): Observable<ResizeObserverEntry[]> {
  return new Observable<ResizeObserverEntry[]>((observer) => {
    var resizeObserver = new ResizeObserver(entries => {
      observer.next(entries);
    });
    resizeObserver.observe(element);
    return () => {
      resizeObserver.disconnect();
    }
  });
}
