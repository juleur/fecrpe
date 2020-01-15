import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { TeachersRoutingModule } from './teachers-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NewCourseComponent } from './new-course/new-course.component';

import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    DashboardComponent, NewCourseComponent,
  ],
  imports: [
    CommonModule, TeachersRoutingModule, ReactiveFormsModule,
    MatDatepickerModule, MatIconModule, MatNativeDateModule,
    MatInputModule, MatFormFieldModule, MatSelectModule, MatProgressBarModule,
    MatProgressSpinnerModule, MatIconModule, MatButtonModule
  ],
  providers: [MatNativeDateModule, MatDatepickerModule],
})
export class TeachersModule { }
