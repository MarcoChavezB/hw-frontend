import { Routes } from '@angular/router';
import { AuthGuard } from './auth-guard-guard';
import { RedirectIfAuthenticatedGuard } from './redirect-if-authenticated.guard.ts-guard';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent),
        canActivate: [RedirectIfAuthenticatedGuard]
    },
    {
        path: 'register',
        loadComponent: () => import('./pages/auth/register/register.component').then(m => m.RegisterComponent),
        canActivate: [RedirectIfAuthenticatedGuard]
    },
    {
        path: 'verify-code',
        loadComponent: () => import('./Views/auth/code/code.component').then(m => m.CodeComponent),
    },
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        loadComponent: () => import('./pages/principal/home/home.component').then(m => m.HomeComponent),
        children: [
            {
                path: '',
                loadComponent: () => import('./pages/principal/fyp/fyp.component').then(m => m.FypComponent),
                canActivate: [AuthGuard]
            },
            {
                path: 'profile',
                loadComponent: () => import('./pages/principal/profile/profile.component').then(m => m.ProfileComponent),
                canActivate: [AuthGuard]
            },
            {
                path: 'profile/:userId',
                loadComponent: () => import('./pages/principal/profile/profile.component').then(m => m.ProfileComponent),
                canActivate: [AuthGuard]
            },
            {
                path: 'upload',
                loadComponent: () => import('./pages/photo/public-post/public-post.component').then(m => m.PublicPostComponent),
                canActivate: [AuthGuard]
            },
            {
                path: 'camera-view',
                loadComponent: () => import('./pages/photo/camera-view/camera-view.component').then(m => m.CameraViewComponent),
                canActivate: [AuthGuard]
            }
        ]
    },
];
