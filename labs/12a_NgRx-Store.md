# Manage state with @ngrx/store

* [Manage state with @ngrx/store](#manage-state-with-ngrxstore)
  * [Setup the store](#setup-the-store)
  * [Setup State Management for a Feature Module](#setup-state-management-for-a-feature-module)
  * [Update a Flight](#update-a-flight)
  * [Bonus: Connecting the Router to the Store *](#bonus-connecting-the-router-to-the-store-)
  * [Bonus: Using NgRx with module federation *](#bonus-using-ngrx-with-module-federation-)
  * [Bonus: Using Mutables with ngrx-immer *](#bonus-using-mutables-with-ngrx-immer-)

## Setup the store

1. Open your ``package.json`` and find out, that some libraries from the ``@ngrx/*`` scope have been installed. One of them is ``@ngrx/schematics`` which extends the CLI by additional commands we are using in the next steps to generate boilerplate code.

2. To setup the ``StoreModule`` and all the needed imports, switch into the folder ``flight-app\src\app`` and run the following command.
  
    ``nx generate @ngrx/schematics:store AppState --root --statePath=+state --module=app.module.ts --project=flight-app``
 
3. Open the new `+state` folder and its ``index.ts`` file.

4. Open the ``app.module.ts`` file and inspect the current changes. You should find some additional imported modules.

    Check whether all ``import`` statements in this file work. If not, correct them (sometimes the generated code has some minor issues).

5. Also import the ``EffectsModule`` into the ``AppModule``. Even though we will use it only later, we have to import it now to make the generated code run.

    ```typescript
    import { EffectsModule } from '@ngrx/effects';

    [...]
    
    imports: [
      [...],
       EffectsModule.forRoot([])
    ];
    ```
   
6. Check your ``AppModule`` of the ``flight-app``:
    
    For the import of the ``StoreDevtoolsModule`` you might need to replace ``isDevMode()``, it should look like this:

    ```typescript
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    ```

## Setup State Management for a Feature Module

1. To setup the ``StoreModule`` for a feature module, switch into the folder ``flight-app\src\app`` and use the following command:
  
    `nx generate @ngrx/schematics:feature flight-booking/+state/flight-booking --module=flight-booking/flight-booking.module.ts --creators`
    
    If you are asked whether to **wire up success and failure functions**, answer with "no". We'll do this by hand in this workshop. If you are asked for a prefix choose the default ``load``.

    Open the new `+state` folder and inspect the files.
      
    Inspect all of them and take a look at the `flight-booking.module.ts` where everything is imported.
    See that the `.forFeature` method is called here.

2. Open the file ``flight-booking.effects.ts`` and remove the body of the class ``FlightBookingEffects`` as well as all unnecessary imports. Will will come back to this file in a later exercise.

    ```typescript
    import { Injectable } from '@angular/core';
    // No other imports, for now

    @Injectable()
    export class FlightBookingEffects {
      // No body, for now
    }
    ```

3. Open the file ``flights-booking.reducer.ts``. On top, insert an interface ``FlightBookingAppState`` that represents the root nodes view to our State:

    ```typescript
    export const flightBookingFeatureKey = 'flightBooking';
    
    export interface FlightBookingAppState {
      flightBooking: State;
    }
    
    [...]
    ```

   Even better you could use the ``flightBookingFeatureKey`` to ensure it has the same string:

    ```typescript
    export const flightBookingFeatureKey = 'flightBooking';
    
    export interface FlightBookingAppState {
      [flightBookingFeatureKey]: State;
    }
    
    [...]
    ```
   
4. In the same file, below the just added ``FlightBookingAppState`` extend the interface ``State`` by a property ``flights`` with the type ``Flight[]``.
    ```typescript
   export interface State {
      flights: Flight[];
    }
    ```

5. Below, define an empty array as the initial state for the new property ``initialState``.
    ```typescript
    export const initialState: State = {
      flights: []
    };
    ```
   
6. Open the file `flight-booking.actions.ts` and set up a ``flightsLoaded`` action creator, replacing the ``loadFlightBookings`` action.

    <details>
    <summary>Show code</summary>
    <p>
   
    You can replace the whole file with the following content:

    ```typescript
    [...]

    export const flightsLoaded = createAction(
      '[FlightBooking] FlightsLoaded',
      props<{flights: Flight[]}>()
    );
    ```

    </p>
    </details>

7. Open the file ``flight-booking.reducer.ts`` and adjust the existing reducer function for the just deleted ``loadFlightBookings`` action so that it handles the ``flightsLoaded`` action.

    <details>
    <summary>Show code</summary>
    <p>

    ```typescript
    // make sure to use this import:
    import * as FlightBookingActions from './flight-booking.actions';
 
    export const reducer = createReducer(
      initialState,

      on(FlightBookingActions.flightsLoaded, (state, { flights }): State => {
        return { ...state, flights };
      })
    )
    ```

    </p>
    </details>

8. Open the file ``flight-search.component.ts``. Inject the Store into the constructor. Introduce a property ``flights$`` (``Observable<Flight[]>``) which points to the flights in the store.

    <details>
    <summary>Show code</summary>
    <p>

    ```typescript
    export class FlightSearchComponent implements OnInit {

      [...]

      readonly flights$ = this.store.select((appState) => appState[flightBookingFeatureKey].flights);

      constructor(
        [...]
        private store: Store<FlightBookingAppState>
      ) {}

      [...]
    }
    ```
    </p>
    </details>

9. Modify the component's ``search`` method so that the loaded flights are send to the store. For this, use the ``FlightService``'s ``find`` method instead of the ``load`` method and dispatch a ``flightsLoaded`` action.

    <details>
    <summary>Show code</summary>
    <p>

    ```typescript
    search(): void {
      if (!this.from || !this.to) {
        return;
      }

      // old:
      // this.flightService.load(...)

      // new:
      this.flightService.find(this.from, this.to, this.urgent).subscribe({
        next: (flights) => { 
          this.store.dispatch(flightsLoaded({ flights }));
        },
        error: (err) => {
          console.error('error', err);
        } 
      });
    }
    ```

    </p>
    </details>

10. Open the component's template, ``flight-search.component.html``, and use the observable ``flights$`` together with the ``async`` pipe instead of the array ``flights``.

    <details>
    <summary>Show code</summary>
    <p>

    ```html
    <div *ngFor="let f of flights$ | async">
      <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
        <app-flight-card [...] />
      </div>
    </div>
    ```

    </p>
    </details>

11. Test your solution

12. If not already installed, install the Chrome plugin ``Redux DevTools`` and use it to trace the dispatched actions.
    
    To install it, use Chrome to navigate to [this page](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=de).

## Update a Flight

In this exercise you will write an action for updating a flight. You will use it to delay the first flight by 15 minutes.

This exercise shows that working with immutables in JavaScript is not always as straight we would like it to be.

1. Open the file ``flight-booking.actions.ts`` and add a ``updateFlight`` action creator for updating a changed flight in the store.

    <details>
    <summary>Show code</summary>
    <p>

    ```typescript
    [...]

    export const updateFlight = createAction(
      '[FlightBooking] Update Flight',
      props<{ flight: Flight }>()
    );
    ```

    </p>
    </details>

2. Open the file ``flight-booking.reducer.ts`` and update the reducer to handle the ``FlightUpdateAction``. 

    <details>
    <summary>Show code</summary>
    <p>

    ```typescript
    [...]
    const reducer = createReducer(
      initialState,

      on(FlightBookingActions.flightsLoaded, (state, { flights }): State => {
        return { ...state, flights };
      }),

      // New:
      on(FlightBookingActions.updateFlight, (state, { flight }): State => {
        const flights = state.flights.map((f) => f.id === flight.id ? flight: f);
        return { ...state, flights };
      })
    );
    [...]
    ```

    </p>
    </details>

3. Open the ``flight-search.component.ts``. Within the ``delay`` method, dispatch a ``FlightUpdateAction`` that delays the first found flight for 15 minutes. As the flight is immutable, you have to create a new one.

    <details>
    <summary>Show code</summary>
    <p>

    ```typescript
    delay(): void {
      this.flights$.pipe(take(1)).subscribe((flights) => {
        const oldDate = new Date(flight[0].date);
        const newDate = new Date(oldDate.getTime() + 15 * 60 * 1000);
        const flight = { ...flight[0], date: newDate.toISOString() };
        
        this.store.dispatch(updateFlight({ flight }));
      });
    }
    ```

    </p>
    </details>

4. Open the ``flight-search.component.html`` file and make sure that the the ``Delay`` button uses the ``flights$`` observable instead of the flights array. A very simple way to accomplish this is using the ``async`` pipe:

    ```html
    <ng-container *ngIf="flights$ | async as flights">
      <button *ngIf="flights.length > 0" class="btn btn-default" (click)="delay()">
        Delay 1st Flight
      </button>
    </ng-container>
    ```

    If there is time, your instructor will discuss alternatives for this with you.

5. Test your solution.


## Bonus: Connecting the Router to the Store *

The ``StoreRouterConnectingModule`` helps to sync your router with the store. This exercise shows how to use it.

1. Open your file ``flight-app/src/app/+state/index.ts``, import the ``routerReducer`` from ``@ngrx/router-store`` and register it:

    ```typescript
    import { routerReducer } from '@ngrx/router-store';
    [...]

    export const reducers: ActionReducerMap<State> = {
      router: routerReducer
    };
    ```

2. In your ``app.module``, configure the ``StoreRouterConnectingModule`` as shown below:

    ```typescript
    import { RouterState } from '@ngrx/router-store';
    [...]
    
    @NgModule({
      imports: [
        [...]
        StoreRouterConnectingModule.forRoot({stateKey: 'router', routerState: RouterState.Minimal })
      ],
      [...]
    })
    export class AppModule {}
    ```

3. Start your application and navigate between the menu points. Open the Redux Devtools and replay all actions. Your should see, that the visited routes are replayed too.


## Bonus: Using NgRx with module federation *

If you're using **module federation** with our `@angular-architects/module-federation` package, then you can add NgRx (and RxJS) to the shared libraries in the webpack configs (for both shell & micro frontends):

```typescript
[...]

   shared: share({ 
     '@angular/core': { [...] },
     [...],
     '@ngrx/store': { [...] },
     '@ngrx/effects': { [...] },
     'rxjs': { [...] },
   
     ...sharedMappings.getDescriptors()
   })

[...]
```

## Bonus: Using Mutables with ngrx-immer *

The project ngrx-immer uses the library immer to allow mutating the state. At least, it looks like this. However, your mutations are only recorded and replayed in an immutable way. As a result, you can write your code as you are used to and although you get the benefits of immutables.

You can quickly try this out:

1. Install ngrx-immer: ``npm i ngrx-immer immer``
2. Lookup its readme: https://www.npmjs.com/package/ngrx-immer
3. Update your reducer so that it uses ``immerOn`` instead of ``on`` as shown in the readme file

**Hint:** If the auto-import feature of your IDE does not work, you can add this import by hand:

```typescript
import { immerOn } from 'ngrx-immer/store';
```
