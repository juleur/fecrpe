import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CoursesComponent } from '../catalogs/courses/courses.component';
import { CourseDetailsComponent } from '../catalogs/course-details/course-details.component';
import { SessionPlayersComponent } from './session-players/session-players.component';
import { AuthUserGuard } from 'src/app/core/guards';

const routes: Routes = [
  { path: 'courses', component: CoursesComponent },
  { path: 'courses/:id', component: CourseDetailsComponent},
  { path: 'courses/:id/vid/:id', component: SessionPlayersComponent, canActivate: [AuthUserGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogsRoutingModule { }
