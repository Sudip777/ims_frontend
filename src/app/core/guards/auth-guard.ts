import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '../store/auth-store';

export function authGuard(role: string | null = null): CanActivateFn {
  return () => {
    const authState = inject(AuthStore);
    const router = inject(Router);
    if (!authState.isAuthenticated() || (role && authState.tokenDecoded()?.role !== role)) {
      router.navigateByUrl('/login');
      return false;
    }
    return true;
  };
}
