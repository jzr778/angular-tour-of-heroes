import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';

import { provideHttpClient } from '@angular/common/http';

import { RouterModule } from '@angular/router';
import {
  NgIf,
  NgFor,
  UpperCasePipe,
} from '@angular/common';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(),
    RouterModule,
    NgFor,

    
  ]
};




