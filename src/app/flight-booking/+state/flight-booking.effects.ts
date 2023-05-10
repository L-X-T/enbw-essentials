import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { concatMap } from 'rxjs/operators';
import { Observable, EMPTY } from 'rxjs';
import * as FlightBookingActions from './flight-booking.actions';

@Injectable()
export class FlightBookingEffects {
  constructor(private actions$: Actions) {}
}
