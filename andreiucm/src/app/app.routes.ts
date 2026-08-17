import { Routes } from '@angular/router';

import { authGuard } from './auth.guard';
import { profileResolver } from './profile.resolver';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./page.landing.component').then((module) => module.LandingPage),
    title: 'Andrei Margine — Frontend Software Developer',
  },
  {
    path: 'private',
    loadComponent: () => import('./private-layout.component').then((module) => module.PrivateLayout),
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home',
        loadComponent: () => import('./page.workspace.component').then((module) => module.PageWorkspaceComponent),
        title: 'Private Workspace — Andrei Margine',
      },
      {
        path: 'profile',
        loadComponent: () => import('./page.profile.component').then((module) => module.ProfileComponent),
        resolve: { profile: profileResolver },
        title: 'Profile — Private Workspace',
      },
      {
        path: 'books',
        loadComponent: () => import('./page.books.component').then((module) => module.BooksComponent),
        title: 'Books — Private Workspace',
      },
      {
        path: 'cv',
        loadComponent: () =>
          import('./page.upcoming-feature.component').then((module) => module.PageUpcomingFeatureComponent),
        data: { feature: 'cv' },
        title: 'Download CV — Private Workspace',
      },
      {
        path: 'messages',
        loadComponent: () =>
          import('./page.upcoming-feature.component').then((module) => module.PageUpcomingFeatureComponent),
        data: { feature: 'messages' },
        title: 'Messages — Private Workspace',
      },
      {
        path: 'channels',
        loadComponent: () =>
          import('./page.upcoming-feature.component').then((module) => module.PageUpcomingFeatureComponent),
        data: { feature: 'channels' },
        title: 'Channels — Private Workspace',
      },
      {
        path: 'grocery',
        loadComponent: () =>
          import('./page.upcoming-feature.component').then((module) => module.PageUpcomingFeatureComponent),
        data: { feature: 'grocery' },
        title: 'Grocery Lists — Private Workspace',
      },
      {
        path: 'files',
        loadComponent: () =>
          import('./page.upcoming-feature.component').then((module) => module.PageUpcomingFeatureComponent),
        data: { feature: 'files' },
        title: 'Files — Private Workspace',
      },
      {
        path: 'task-pilot',
        loadComponent: () =>
          import('./page.upcoming-feature.component').then((module) => module.PageUpcomingFeatureComponent),
        data: { feature: 'task-pilot' },
        title: 'Task Pilot — Private Workspace',
      },
      {
        path: 'document-ai',
        loadComponent: () =>
          import('./page.upcoming-feature.component').then((module) => module.PageUpcomingFeatureComponent),
        data: { feature: 'document-ai' },
        title: 'Document AI — Private Workspace',
      },
      {
        path: 'reconcile',
        loadComponent: () =>
          import('./page.upcoming-feature.component').then((module) => module.PageUpcomingFeatureComponent),
        data: { feature: 'reconcile' },
        title: 'Reconcile — Private Workspace',
      },
    ],
  },
  { path: 'home', redirectTo: '/', pathMatch: 'full' },
  { path: 'profile', redirectTo: '/private/profile', pathMatch: 'full' },
  { path: 'books', redirectTo: '/private/books', pathMatch: 'full' },
  { path: 'login', redirectTo: '/', pathMatch: 'full' },
  { path: 'signup', redirectTo: '/', pathMatch: 'full' },
  {
    path: '**',
    loadComponent: () => import('./page.not-found.component').then((module) => module.NotFoundComponent),
  },
];
