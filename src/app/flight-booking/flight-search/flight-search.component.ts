import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Flight } from '../../entities/flight';
import { FlightService } from '../shared/services/flight.service';
import { Subject, Subscription, take } from 'rxjs';
import { share, takeUntil } from 'rxjs/operators';
import { pattern } from '../../shared/global';
import { FlightBookingAppState, flightBookingFeatureKey } from '../+state/flight-booking.reducer';
import { Store } from '@ngrx/store';
import { loadFlights, updateFlight } from '../+state/flight-booking.actions';
import { selectFlightsWithProps, selectIsLoadingFlights, selectLoadFlightsError } from '../+state/flight-booking.selectors';

@Component({
  selector: 'app-flight-search',
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css']
})
export class FlightSearchComponent implements OnInit, OnDestroy {
  from = 'Hamburg';
  to = 'Graz';
  urgent = false;

  minLength = 3;
  maxLength = 15;

  flights: Flight[] = [];

  // flights$: Observable<Flight[]> | undefined;
  // flights$ = this.store.select((appState) => appState[flightBookingFeatureKey].flights);
  flights$ = this.store.select(selectFlightsWithProps({ blackList: [3] }));
  isLoadingFlights$ = this.store.select(selectIsLoadingFlights);
  loadFlightsError$ = this.store.select(selectLoadFlightsError);

  flightsSubscription: Subscription | undefined;

  selectedFlight: Flight | undefined | null;
  flightToEdit: Flight | undefined | null;
  pattern = pattern;

  message = '';

  private readonly onDestroySubject = new Subject<void>();
  readonly terminator$ = this.onDestroySubject.asObservable();

  basket: { [id: number]: boolean } = {
    3: true,
    5: true
  };

  @ViewChild('flightSearchForm') flightSearchForm?: FormGroup;

  constructor(private flightService: FlightService, private store: Store) {}

  ngOnInit(): void {
    if (this.from && this.to) {
      // this.search();
    }
  }

  ngOnDestroy(): void {
    // 4a. my unsubscribe
    // this.flightsSubscription?.unsubscribe();

    // 4b. subject emit thru terminator$
    this.onDestroySubject.next(void 0);
    this.onDestroySubject.complete();
  }

  search(): void {
    if (this.flightSearchForm && (!this.from || !this.to || this.flightSearchForm.invalid)) {
      this.markFormGroupDirty(this.flightSearchForm);
      return;
    }

    // 1. my observable
    // this.flights$ = this.flightService.find(this.from, this.to).pipe(share());

    // 2. my observer
    /*const flightsObserver: Observer<Flight[]> = {
      next: (flights) => (this.flights = flights),
      error: (errResp) => console.error('Error loading flights', errResp),
      complete: () => {
        // console.warn('complete');
      }
    };*/

    // 3a. my subscription
    // this.flightsSubscription?.unsubscribe();
    // this.flightsSubscription = this.flights$.subscribe(flightsObserver);

    // 3b. takeUntil terminator$ emits
    // this.flights$.pipe(takeUntil(this.terminator$)).subscribe(flightsObserver);

    /*this.flightsSubscription = this.flightService.find(this.from, this.to).subscribe({
      next: (flights) => {
        this.store.dispatch(flightsLoaded({ flights }));
      },
      error: (err) => {
        console.error('error', err);
      }
    });*/

    this.store.dispatch(
      loadFlights({
        from: this.from,
        to: this.to,
        urgent: this.urgent
      })
    );
  }

  private markFormGroupDirty(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach((c) => c.markAsDirty());
  }

  select(f: Flight): void {
    this.selectedFlight = f;
  }

  /*save(): void {
    if (this.selectedFlight) {
      this.flightService.save(this.selectedFlight).subscribe({
        next: (flight) => {
          this.selectedFlight = flight;
          this.message = 'Success!';
        },
        error: (errResponse) => {
          console.error('Error', errResponse);
          this.message = 'Error!';
        }
      });
    }
  }*/

  trackById(index: number, flight: Flight): number {
    return flight.id;
  }

  updateFlight(updatedFlight: Flight): void {
    // console.warn('FlightSearchComponent - updateFlight()');
    // console.log(updatedFlight);

    this.flights = this.flights.map((flight) => (flight.id === updatedFlight.id ? updatedFlight : flight));

    this.search(); // to update the results
  }

  delayFirstFlight(): void {
    this.flights$.pipe(take(1)).subscribe((flights) => {
      const flight = flights[0];

      const oldDate = new Date(flight.date);
      const newDate = new Date(oldDate.getTime() + 15 * 60 * 1000);
      const newFlight = { ...flight, date: newDate.toISOString() };

      this.store.dispatch(updateFlight({ flight: newFlight }));
    });
  }
}
