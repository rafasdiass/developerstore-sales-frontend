import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // Mantém a detecção de mudanças baseada em zona, com coalescência de eventos
    provideZoneChangeDetection({ eventCoalescing: true }),

    // Registra o roteamento standalone com as rotas definidas
    provideRouter(routes),

    // Habilita hidratação no cliente (para SSR ou replays de evento)
    provideClientHydration(withEventReplay()),

    // Fornece o HttpClient para toda a aplicação standalone
    provideHttpClient(),
  ],
};
