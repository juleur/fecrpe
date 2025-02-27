import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CoursesComponent } from './courses/courses.component';
import { ProfilComponent } from './profil/profil.component';


const routes: Routes = [
  { path: 'mes-cours', component: CoursesComponent },
  { path: 'mon-profil', component: ProfilComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
