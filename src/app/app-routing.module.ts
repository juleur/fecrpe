import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
