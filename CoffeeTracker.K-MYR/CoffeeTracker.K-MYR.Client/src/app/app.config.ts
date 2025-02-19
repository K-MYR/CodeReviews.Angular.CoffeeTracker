import { VIEWPORT_WIDTH } from './tokens/injectionTokens';
import { ChartDefaults } from './chart.defaults';

import { ApplicationConfig, Injector, PLATFORM_ID, provideZoneChangeDetection } from '@angular/core';
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
    provideCharts(ChartDefaults),    
  ]    
};
