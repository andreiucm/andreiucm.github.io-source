import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';
import { profileResolver } from "./profile.resolver";

export const routes: Routes = [
	{
		path: "",
		loadComponent: () =>
			import("./page.landing.component").then((m) => m.LandingPage),
		title: "Andrei Margine — Frontend Software Developer",
	},
	{
		path: "private",
		loadComponent: () =>
			import("./private-layout.component").then((m) => m.PrivateLayout),
		canActivate: [authGuard],
		children: [
			{ path: "", redirectTo: "profile", pathMatch: "full" },
			{
				path: "profile",
				loadComponent: () => import("./page.profile.component").then((m) => m.ProfileComponent),
				resolve: { profile: profileResolver },
			},
			{
				path: "books",
				loadComponent: () => import("./page.books.component").then((m) => m.BooksComponent),
			},
		],
	},
	{ path: "home", redirectTo: "/", pathMatch: "full" },
	{ path: "profile", redirectTo: "/private/profile", pathMatch: "full" },
	{ path: "books", redirectTo: "/private/books", pathMatch: "full" },
	{ path: "login", redirectTo: "/", pathMatch: "full" },
	{ path: "signup", redirectTo: "/", pathMatch: "full" },
	{
		path: "**",
		loadComponent: () =>
			import("./page.not-found.component").then((m) => m.NotFoundComponent),
	},
];
