import { createFeature, createReducer, on } from '@ngrx/store';
import * as FlightBookingActions from './flight-booking.actions';

export const flightBookingFeatureKey = 'flightBooking';

export interface State {

}

export const initialState: State = {

};

export const reducer = createReducer(
  initialState,
  on(FlightBookingActions.loadFlightBookings, state => state),

);

export const flightBookingFeature = createFeature({
  name: flightBookingFeatureKey,
  reducer,
});

