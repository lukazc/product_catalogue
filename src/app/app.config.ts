import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth.interceptor';
import { authTokenRefreshInterceptor } from './interceptors/auth-token-refresh.interceptor';

/**
 * The application configuration.
 * @type {ApplicationConfig}
 */ 
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(
        withInterceptors([authInterceptor, authTokenRefreshInterceptor])
    )
  ]
};
