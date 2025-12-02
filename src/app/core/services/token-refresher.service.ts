import { inject, Injectable } from '@angular/core';
import { interval } from 'rxjs';
import { AuthStore } from '../store/auth-store';

@Injectable({ providedIn: 'root' })
export class TokenRefresher {
  private authStore = inject(AuthStore);

  constructor() {
    // Check every 30 seconds
    interval(30000).subscribe(() => {
      const token = this.authStore.token();
      if (!token) return;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const decoded: any = this.authStore.tokenDecoded();
      if (!decoded?.exp) return;

      const expiresIn = decoded.exp * 1000 - Date.now();
      if (expiresIn < 60000) {
        // refresh 1 minute before expiry
        this.authStore.refresh().subscribe({
          next: () => console.log('Token refreshed'),
          error: () => this.authStore.logout(),
        });
      }
    });
  }
}
