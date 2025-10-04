import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { IconComponent } from '../../shared/icons/components/icon.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [ButtonModule, IconComponent],
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.scss'],
})
export class MainLayout {}
