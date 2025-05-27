import { CHART_DEFAULTS } from './chart.defaults';
import { VIEWPORT_SIZE } from './tokens/injectionTokens';

import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration} from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideCharts } from 'ng2-charts';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(withFetch()),
    provideCharts(CHART_DEFAULTS),
    { provide: VIEWPORT_SIZE, useValue: { height: null, width: null}}
  ]    
};
