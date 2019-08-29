import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CatalogsRoutingModule } from './catalogs-routing.module';

import { CoursesComponent } from './courses/courses.component';
import { CourseDetailsComponent } from './course-details/course-details.component';

import { CourseCardComponent } from './../../shared/components/course-card/course-card.component';
import { SessionPlayersComponent } from './session-players/session-players.component';

@NgModule({
  declarations: [
    CoursesComponent, CourseDetailsComponent,
    CourseCardComponent, SessionPlayersComponent
  ],
  imports: [CommonModule, CatalogsRoutingModule]
})
export class CatalogsModule { }
