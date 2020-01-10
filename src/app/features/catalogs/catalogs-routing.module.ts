import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CoursesComponent } from '../catalogs/courses/courses.component';
import { CourseDetailsComponent } from '../catalogs/course-details/course-details.component';
import { SessionPlayersComponent } from './session-players/session-players.component';

import { LoggedInGuard } from 'src/app/core/guards/logged-in.guard';
import { KeepLoggedInGuard } from 'src/app/core/guards/keep-logged-in.guard';

const routes: Routes = [
  { path: 'courses', component: CoursesComponent, canActivate: [KeepLoggedInGuard] },
  { path: 'courses/:id', component: CourseDetailsComponent, canActivate: []},
  { path: 'courses/:id/vid/:vid', component: SessionPlayersComponent, canActivate: [LoggedInGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogsRoutingModule { }
