import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewCourseComponent } from './new-course/new-course.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'new-course', component: NewCourseComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeachersRoutingModule { }
