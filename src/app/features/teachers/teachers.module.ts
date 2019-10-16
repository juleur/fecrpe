import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { TeachersRoutingModule } from './teachers-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NewCourseComponent } from './new-course/new-course.component';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatFormFieldModule } from '@angular/material';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    DashboardComponent, NewCourseComponent,
  ],
  imports: [
    CommonModule, TeachersRoutingModule, ReactiveFormsModule,
    MatDatepickerModule, MatNativeDateModule, MatIconModule,
    MatInputModule, MatFormFieldModule, MatSelectModule, MatProgressBarModule,
    MatProgressSpinnerModule
  ],
})
export class TeachersModule { }
