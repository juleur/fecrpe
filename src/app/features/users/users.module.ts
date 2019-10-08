import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { UsersRoutingModule } from './users-routing.module';
import { ProfilComponent } from './profil/profil.component';
import { CoursesComponent } from './courses/courses.component';
import { CourseCardComponent } from './courses/course-card/course-card.component';

@NgModule({
  declarations: [
    ProfilComponent, CoursesComponent, CourseCardComponent
  ],
  imports: [
    CommonModule, UsersRoutingModule, ReactiveFormsModule,
    FormsModule, RouterModule
  ],
})
export class UsersModule { }
