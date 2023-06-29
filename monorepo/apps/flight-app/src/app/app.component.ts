import { Component } from '@angular/core';

import { LoggerService } from '@flight-workspace/logger-lib';

import { environment } from '../environments/environment';

@Component({
  selector: 'flight-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private loggerService: LoggerService) {
    if (!environment.production) {
      console.warn('hello from your console');

      this.loggerService.log('log');
      this.loggerService.debug('debug');
    }
  }
}
