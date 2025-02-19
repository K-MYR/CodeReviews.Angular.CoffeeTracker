import { InjectionToken } from "@angular/core";

export interface ViewportSize {
  width: number | null,
  height: number | null
}

export const VIEWPORT_SIZE = new InjectionToken<ViewportSize>('VIEWPORT_SIZE');
