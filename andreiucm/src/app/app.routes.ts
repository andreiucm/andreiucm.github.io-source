import { Routes } from '@angular/router';
import { homeGuard } from './home.guard';
import { authGuard } from './auth.guard';
import { profileResolver } from "./profile.resolver";

export const routes: Routes = [
	{
		path: "",
		redirectTo: "/home",
		pathMatch: "full",
	},
	{
		path: "home",
		loadComponent: () =>
			import("./page.home.component").then((m) => m.HomeComponent),
		canActivate: [homeGuard],
	},
	{
		path: "profile",
		loadComponent: () =>
			import("./page.profile.component").then((m) => m.ProfileComponent),
		resolve: {
			profile: profileResolver,
		},
		canActivate: [authGuard],
	},
	{
		path: "login",
		loadComponent: () =>
			import("./page.login.component").then((m) => m.LoginComponent),
	},
	{
		path: "signup",
		loadComponent: () =>
			import("./page.signup.component").then((m) => m.SignupComponent),
	},
	{
		path: "books",
		loadComponent: () =>
			import("./page.books.component").then((m) => m.BooksComponent),
		canActivate: [authGuard],
	},
	{
		path: "**",
		loadComponent: () =>
			import("./page.not-found.component").then((m) => m.NotFoundComponent),
	},
];
