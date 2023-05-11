import { createAction, props } from '@ngrx/store';
import { Flight } from '../../entities/flight';
import { HttpErrorResponse } from '@angular/common/http';

export const loadFlights = createAction('[FlightBooking] Load Flights', props<{ from: string; to: string }>());
export const loadFlightsError = createAction('[FlightBooking] Load Flights Error', props<{ err: HttpErrorResponse }>());
export const loadFlightsSuccess = createAction('[FlightBooking] Load Flights Success', props<{ flights: Flight[] }>());

export const updateFlight = createAction('[FlightBooking] Update Flight', props<{ flight: Flight }>());
