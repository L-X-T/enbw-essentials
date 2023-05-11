import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromFlightBooking from './flight-booking.reducer';

export const selectFlightBookingState = createFeatureSelector<fromFlightBooking.State>(fromFlightBooking.flightBookingFeatureKey);

export const selectFlights = createSelector(selectFlightBookingState, (featureState) => featureState.flights);
export const negativeList = createSelector(selectFlightBookingState, (featureState) => featureState.negativeList);

export const selectedFilteredFlights = createSelector(selectFlights, negativeList, (flights, negativeList) =>
  flights.filter((f) => !negativeList.includes(f.id))
);

export const selectFlightsWithProps = (props: { blackList: number[] }) =>
  createSelector(selectFlights, (flights) => flights.filter((f) => !props.blackList.includes(f.id)));

export const selectIsLoadingFlights = createSelector(selectFlightBookingState, (featureState) => featureState.isLoadingFlights);
export const selectLoadFlightsError = createSelector(selectFlightBookingState, (featureState) => featureState.loadFlightsError);
