import {ApplicationConfig, isDevMode} from '@angular/core';
import {provideRouter} from '@angular/router';
import {routes} from './app.routes';
import {provideStore} from '@ngrx/store';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {ConfigService} from './services/config.service';
import {KioskReducer} from './state/kiosk/kiosk.reducer';
import {provideAnimations} from '@angular/platform-browser/animations';
import {provideEffects} from "@ngrx/effects";
import {KioskEffects} from "src/app/state/kiosk/kiosk.effects";
import {provideStoreDevtools} from "@ngrx/store-devtools";
import pk from '../../package.json';
import {authenticationInterceptor} from "../app/interceptors/httpInterceptor";
import {provideClientHydration, withNoHttpTransferCache} from "@angular/platform-browser";
import { AuthService } from './services/auth.service';
import { provideServiceWorker } from '@angular/service-worker';

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(withNoHttpTransferCache()),
    provideRouter(routes),
    provideStore({ kiosk: KioskReducer }),
    provideEffects([KioskEffects]),
    provideStoreDevtools({
        name: pk.name,
        maxAge: 25,
        logOnly: isDevMode(),
        autoPause: true,
        trace: false,
        traceLimit: 75,
    }),
    provideAnimations(),
    provideHttpClient(withInterceptors([authenticationInterceptor])),
    ConfigService,
    AuthService,
    provideServiceWorker('ngsw-worker.js', {
        enabled: !isDevMode(),
        registrationStrategy: 'registerWhenStable:30000'
    })
],
};
