import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { map, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import * as FlightBookingActions from './flight-booking.actions';
import { FlightService } from '../shared/services/flight.service';

@Injectable()
export class FlightBookingEffects {
  loadFlights$ = createEffect(
    (): Observable<any> =>
      this.actions$.pipe(
        ofType(FlightBookingActions.loadFlights),
        switchMap((action) => this.flightService.find(action.from, action.to)),
        map((flights) => FlightBookingActions.flightsLoaded({ flights }))
      )
  );

  constructor(private actions$: Actions, private flightService: FlightService) {}
}
