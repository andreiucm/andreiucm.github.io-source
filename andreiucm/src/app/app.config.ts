import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideServiceWorker } from '@angular/service-worker';
import { provideZard } from '@/shared/core';
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { authInterceptorFn } from "./auth.interceptor";

export const appConfig: ApplicationConfig = {
	providers: [
		provideHttpClient(withInterceptors([authInterceptorFn])),
		provideZard(),
		provideBrowserGlobalErrorListeners(),
		provideZonelessChangeDetection(),
		provideRouter(routes),
		provideServiceWorker("ngsw-worker.js", {
			enabled: !isDevMode(),
			registrationStrategy: "registerWhenStable:30000",
		}),
	],
};
