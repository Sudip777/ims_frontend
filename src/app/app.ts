import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toast } from 'primeng/toast';
import { AuthService } from './core/services/auth.service';
import { TokenRefresher } from './core/services/token-refresher.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toast],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('inventory-management-system');
  authService = inject(AuthService);
  tokenRefresher = inject(TokenRefresher);

  userDetails: unknown[] = [];
}
