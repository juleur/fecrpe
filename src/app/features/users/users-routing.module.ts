import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CoursesComponent } from './courses/courses.component';
import { ProfilComponent } from './profil/profil.component';

import { AuthUserGuard } from 'src/app/core/guards';

const routes: Routes = [
  { path: 'mes-cours', component: CoursesComponent, canActivate: [AuthUserGuard] },
  { path: 'mon-profil', component: ProfilComponent, canActivate: [AuthUserGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
