import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {TranslateService} from "@ngx-translate/core";
// import { MaestroPageComponent } from './standalone-components/maestro-page/maestro-page.component';
@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [CommonModule, RouterOutlet]
})
export class AppComponent {
  title = 'iotzen-ui-maestro';
  constructor(private  translate: TranslateService) {
    this.translate.setDefaultLang('en');
    this.translate.use('en').subscribe({
      next: console.log,
      error: console.error
    });
  }
}
