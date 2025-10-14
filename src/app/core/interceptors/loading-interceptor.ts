import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { HttpInterceptorFn } from '@angular/common/http';
import { LoadingService } from '../services/loading';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loader = inject(LoadingService);
  loader.show();

  return next(req).pipe(finalize(() => loader.hide()));
};
