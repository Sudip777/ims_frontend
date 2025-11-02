import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { PrimeNG } from 'primeng/config';
import { ButtonComponent } from '../../shared/components/button/button';
import { IconComponent } from '../../shared/icons/components/icon.component';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [ButtonModule, IconComponent, ButtonComponent, RouterLink, Footer],
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.scss'],
})
export class MainLayout implements OnInit {
  private primeng = inject(PrimeNG);

  ngOnInit() {
    this.primeng.ripple.set(true);
  }
}
