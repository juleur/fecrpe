import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PlyrModule } from 'ngx-plyr';
import { CatalogsRoutingModule } from './catalogs-routing.module';

import { CoursesComponent } from './courses/courses.component';
import { CourseDetailsComponent } from './course-details/course-details.component';
import { CourseCardComponent } from './courses/course-card/course-card.component';
import { SessionPlayersComponent } from './session-players/session-players.component';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    CoursesComponent, CourseDetailsComponent,
    SessionPlayersComponent, CourseCardComponent,
  ],
  imports: [
    CommonModule, CatalogsRoutingModule, RouterModule, PlyrModule,
    MatButtonModule, MatIconModule
  ],
})
export class CatalogsModule { }
