import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import * as FlightBookingActions from './flight-booking.actions';
import { FlightService } from '../shared/services/flight.service';

@Injectable()
export class FlightBookingEffects {
  loadFlights$ = createEffect(
    (): Observable<any> =>
      this.actions$.pipe(
        ofType(FlightBookingActions.loadFlights),
        switchMap((action) =>
          this.flightService.find(action.from, action.to).pipe(
            map((flights) => FlightBookingActions.loadFlightsSuccess({ flights })),
            catchError((loadFlightsError) => of(FlightBookingActions.loadFlightsError({ loadFlightsError })))
          )
        )
      )
  );

  constructor(private actions$: Actions, private flightService: FlightService) {}
}
