import { Component, inject } from '@angular/core';
import { AirportService } from '@flight-workspace/flight-lib';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-airport',
  templateUrl: './airport.component.html'
})
export class AirportComponent {
  airports: string[] = [];
  readonly airports$ = inject(AirportService)
    .findAll()
    .pipe(takeUntilDestroyed())
    .subscribe((airports) => (this.airports = airports));
}
