import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CourseCardComponent } from './../shared/components/course-card/course-card.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [CourseCardComponent],
  exports: [CourseCardComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { }
