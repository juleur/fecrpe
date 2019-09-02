import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule} from '@angular/forms';

import { UsersRoutingModule } from './users-routing.module';
import { ProfilComponent } from './profil/profil.component';
import { CoursesComponent } from './courses/courses.component';
import { CourseCardComponent } from './../../shared/components/course-card/course-card.component';


@NgModule({
  declarations: [ProfilComponent, CoursesComponent, CourseCardComponent],
  imports: [
    CommonModule, UsersRoutingModule,
    ReactiveFormsModule, FormsModule,
  ]
})
export class UsersModule { }
