import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { IconComponent } from '../../icons/components/icon.component';
import { ButtonComponent } from '../button/button';

@Component({
  selector: 'app-notfound',
  standalone: true,
  imports: [RouterModule, ButtonModule, IconComponent, ButtonComponent],
  templateUrl: `./not-found.html`,
})
export class Notfound {}
