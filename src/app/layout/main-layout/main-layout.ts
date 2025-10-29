import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { IconComponent } from '../../shared/icons/components/icon.component';
import { ButtonComponent } from '../../shared/components/button/button';
import { PrimeNG } from 'primeng/config';
import { RouterLink } from '@angular/router';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [ButtonModule, IconComponent, ButtonComponent, RouterLink, Footer],
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.scss'],
})
export class MainLayout implements OnInit {
  constructor(private primeng: PrimeNG) {}

  ngOnInit() {
    this.primeng.ripple.set(true);
  }
}
