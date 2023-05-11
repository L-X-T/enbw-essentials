import { createReducer, on } from '@ngrx/store';
import * as FlightBookingActions from './flight-booking.actions';
import { Flight } from '../../entities/flight';

export const flightBookingFeatureKey = 'flightBooking';

export interface FlightBookingAppState {
  [flightBookingFeatureKey]: State;
}

export interface State {
  flights: Flight[];
}

export const initialState: State = {
  flights: []
};

export const reducer = createReducer(
  initialState,

  on(FlightBookingActions.flightsLoaded, (state, { flights }): State => {
    return { ...state, flights };
  }),

  on(FlightBookingActions.updateFlight, (state, { flight }): State => {
    const flights = state.flights.map((f) => (f.id === flight.id ? flight : f));
    return { ...state, flights };
  })
);
