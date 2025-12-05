import { inject, Injectable } from '@angular/core';
import { interval } from 'rxjs';
import { AuthStore } from '../store/auth-store';

@Injectable({ providedIn: 'root' })
export class TokenRefresher {
  private authStore = inject(AuthStore);

  constructor() {
    // Check immediatelyy on startup
    this.checkAndRefresh();

    //  checkk every 30 seconds
    interval(30000).subscribe(() => this.checkAndRefresh());
  }

  private checkAndRefresh() {
    const token = this.authStore.token();
    if (!token) return;

    const decoded = this.authStore.tokenDecoded();
    if (!decoded?.exp) return;

    const expiresIn = decoded.exp * 1000 - Date.now();
    console.log(`Token expires in: ${Math.floor(expiresIn / 1000)} seconds`);

    if (expiresIn < 60000) {
      console.log(' Refreshing token...');
      this.authStore.refresh().subscribe({
        next: () => console.log('Token refreshed'),
        error: (err) => {
          console.error('Refresh failed:', err);
          this.authStore.logout();
        },
      });
    }
  }
}
