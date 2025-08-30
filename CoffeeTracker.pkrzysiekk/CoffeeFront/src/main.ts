/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { importProvidersFrom } from '@angular/core';
import {
  HttpClient,
  HttpClientModule,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { CoffeeModule } from './app/coffee/coffee.module';
import { coffeeRoutes } from './app/coffee/coffee-routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter([
      { path: 'coffee', children: coffeeRoutes },
      { path: '', redirectTo: 'coffee', pathMatch: 'full' },
    ]),
  ],
});
