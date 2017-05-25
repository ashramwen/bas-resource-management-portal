import { Routes } from '@angular/router';

import { LoginCmp } from './pages/login/login.component';
import { AuthGuard } from './shared/providers/guards/authen-guard.service';
import { Component } from '@angular/core';
import { DeviceListCmp } from './pages/+portal/device-list/device-list.component';
import { portalRoutes } from './pages/+portal/portal.routes';
import { MetaGuard } from './shared/providers/guards/meta-guard.service';
import { CacheGuard } from './shared/providers/guards/cache-guard.service';

export const ROUTES: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginCmp,
  },
  {
    path: 'portal',
    children: [...portalRoutes],
    canActivate: [
      AuthGuard,
      MetaGuard,
    ]
  },
  { path: '**', redirectTo: 'login' }
];
