import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TeacherGuard, LoggedInGuard } from './core/guards';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then(mod => mod.AuthModule)
  },
  {
    path: 'u',
    loadChildren: () => import('./features/users/users.module').then(mod => mod.UsersModule)
  },
  {
    path: 'formations',
    loadChildren: () => import('./features/catalogs/catalogs.module').then(mod => mod.CatalogsModule)
  },
  {
    path: 'panel/teachers',
    loadChildren: () => import('./features/teachers/teachers.module').then(mod => mod.TeachersModule),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
