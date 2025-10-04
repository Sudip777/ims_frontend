import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { IconComponent } from '../../shared/icons/components/icon.component';
import { ButtonComponent } from '../../shared/components/button/button';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [ButtonModule, IconComponent, ButtonComponent],
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.scss'],
})
export class MainLayout {}
