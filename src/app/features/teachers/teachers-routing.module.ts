import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewCourseComponent } from './new-course/new-course.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoggedInGuard } from 'src/app/core/guards';

const routes: Routes = [
  { path: '', component: DashboardComponent, canActivate: [LoggedInGuard] },
  { path: 'new-course', component: NewCourseComponent, canActivate: [LoggedInGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeachersRoutingModule { }
