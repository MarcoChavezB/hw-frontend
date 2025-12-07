import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/principal/home/home.component').then(m => m.HomeComponent),
    children: [
      {
        path: 'fyp',
        loadComponent: () => import('./pages/principal/fyp/fyp.component').then(m => m.FypComponent)
      },
{
  path: 'profile', // sin ID
  loadComponent: () => import('./pages/principal/profile/profile.component').then(m => m.ProfileComponent)
},
{
  path: 'profile/:userId', // con ID
  loadComponent: () => import('./pages/principal/profile/profile.component').then(m => m.ProfileComponent)
},
      {
        path: 'upload',
        loadComponent: () => import('./pages/photo/public-post/public-post.component').then(m => m.PublicPostComponent)
      },
      {
        path: 'camera-view',
        loadComponent: () => import('./pages/photo/camera-view/camera-view.component').then(m => m.CameraViewComponent)
      }
    ]
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/auth/register/register.component').then(m => m.RegisterComponent)
  }
];
