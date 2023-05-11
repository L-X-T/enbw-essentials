import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromFlightBooking from './flight-booking.reducer';

export const selectFlightBookingState = createFeatureSelector<fromFlightBooking.State>(fromFlightBooking.flightBookingFeatureKey);

export const selectFlights = (appState: fromFlightBooking.FlightBookingAppState) =>
  appState[fromFlightBooking.flightBookingFeatureKey].flights;
export const negativeList = (appState: fromFlightBooking.FlightBookingAppState) =>
  appState[fromFlightBooking.flightBookingFeatureKey].negativeList;

export const selectedFilteredFlights = createSelector(selectFlights, negativeList, (flights, negativeList) =>
  flights.filter((f) => !negativeList.includes(f.id))
);
