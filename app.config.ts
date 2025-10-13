// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura'; // Import your chosen theme

export const appConfig: ApplicationConfig = {
  providers: [
    // ... other providers
    providePrimeNG({
      theme: {
        preset: Aura, // Or your chosen theme
        options: {
          cssLayer: {
            name: 'primeng',
            order: 'tailwind, primeng', // Or your desired order
          },
        },
      },
    }),
  ],
};
