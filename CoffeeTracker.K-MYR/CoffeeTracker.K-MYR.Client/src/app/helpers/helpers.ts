import { Observable } from "rxjs";

export function removeUndefinedValuesFromObject<T extends Record<string, any>>(obj: T): T {
  Object.keys(obj).forEach((key) => obj[key] == null && delete obj[key]);
  return obj;
}

export function resizeObserverToObserverable(element: HTMLElement): Observable <ResizeObserverEntry[]> {
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
