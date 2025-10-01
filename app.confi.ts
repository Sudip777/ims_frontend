// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura'; // Import your chosen theme

export const appConfig: ApplicationConfig = {
  providers: [
    // ... other providers
    providePrimeNG({
      theme: {
        preset: Aura, // Apply the theme preset
        // options: { ... } // Optional: configure prefix, dark mode, etc.
      },
    }),
  ],
};
