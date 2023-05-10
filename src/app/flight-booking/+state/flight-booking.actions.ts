import { createAction, props } from '@ngrx/store';
import { Flight } from '../../entities/flight';

export const flightsLoaded = createAction('[FlightBooking] Flights Loaded', props<{ flights: Flight[] }>());
