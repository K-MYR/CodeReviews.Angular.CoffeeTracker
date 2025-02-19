import { ChartDefaults } from './chart.defaults';

import { ApplicationConfig, inject, provideZoneChangeDetection, REQUEST } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration} from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideCharts } from 'ng2-charts';
import { VIEWPORT_SIZE } from './tokens/injectionTokens';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(withFetch()),
    provideCharts(ChartDefaults)    
  ]    
};
