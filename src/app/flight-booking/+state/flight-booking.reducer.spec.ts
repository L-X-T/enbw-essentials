import { reducer, initialState } from './flight-booking.reducer';

describe('FlightBooking Reducer', () => {
  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as never;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
