import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TeacherGuard, LoggedInGuard } from './core/guards';
import { AuthGuard } from './core/guards/auth.guard';
import { HomepageComponent } from './core/layouts/homepage/homepage.component';

import { HomepageResolver } from './core/resolvers/homepage.resolver';

const routes: Routes = [
  {
    path: '',
    component: HomepageComponent,
    resolve: { homepage: HomepageResolver }
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then(mod => mod.AuthModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'u',
    loadChildren: () => import('./features/users/users.module').then(mod => mod.UsersModule),
    canActivate: [LoggedInGuard],
  },
  {
    path: 'formations',
    loadChildren: () => import('./features/catalogs/catalogs.module').then(mod => mod.CatalogsModule)
  },
  {
    path: 'panel/teachers',
    loadChildren: () => import('./features/teachers/teachers.module').then(mod => mod.TeachersModule),
    canLoad: [TeacherGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
