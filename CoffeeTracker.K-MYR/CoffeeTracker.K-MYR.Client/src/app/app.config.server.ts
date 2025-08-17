import { VIEWPORT_SIZE } from './tokens/injectionTokens';
import { mergeApplicationConfig, ApplicationConfig, REQUEST } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { provideServerRouting } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideServerRouting(serverRoutes),
    {
      provide: VIEWPORT_SIZE,
      useFactory: (request: Request) => {
        const widthHint = request?.headers.get('Sec-CH-Viewport-Width');
        const width = widthHint ? parseFloat(widthHint) : null;
        const heightHint = request?.headers.get('Sec-CH-Viewport-Height');
        const height = heightHint ? parseFloat(heightHint) : null;
        return { width: width, height: height }        
      },
      deps: [ REQUEST ]
    }
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
