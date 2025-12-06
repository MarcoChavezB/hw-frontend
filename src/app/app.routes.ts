import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/principal/home/home.component').then(m => m.HomeComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/principal/fyp/fyp.component').then(m => m.FypComponent)
      },
      {
        path: 'fyp',
        loadComponent: () => import('./pages/principal/fyp/fyp.component').then(m => m.FypComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./pages/principal/profile/profile.component').then(m => m.ProfileComponent)
      },
    ]
  }
];
