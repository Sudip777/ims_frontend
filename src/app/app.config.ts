import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import Aura from '@primeng/themes/aura';
import { providePrimeNG } from 'primeng/config';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ConfirmationService, MessageService } from 'primeng/api';
import { routes } from './app.routes';
import { loadingInterceptor } from './core/interceptors/loading-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptors([loadingInterceptor])),
    provideRouter(routes),
    provideAnimationsAsync(),
    ConfirmationService,
    MessageService,
    providePrimeNG({
      theme: {
        preset: Aura,
      },
    }),
  ],
};
