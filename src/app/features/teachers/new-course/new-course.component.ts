import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';

import { UploadVideoGQL } from '../../../core/graphql/mutations/upload-video-gql';
import { TeacherCoursesGQL } from '../../../core/graphql/queries/teacher-courses-gql';
import { Subject, Type, RefresherCourse } from 'src/app/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'new-course',
  templateUrl: './new-course.component.html',
  styleUrls: ['./new-course.component.scss']
})
export class NewCourseComponent implements OnInit {
  rcForm: FormGroup;
  typesCourse: string[] = Object.values(Type);
  refresherCourses: RefresherCourse[] = [
    {id: 1, subject: {id: 1, name: 'Mathématique'}},
    {id: 2, subject: {id: 5, name: 'Français'}}
  ];
  progressUpload = 0;

  constructor(
    private fb: FormBuilder,
    private apollo: Apollo,
    private uploadVideoGQL: UploadVideoGQL,
    private teacherCoursesGQL: TeacherCoursesGQL
  ) { }

  ngOnInit() {
    this.rcForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(5)]],
      refresherCourse: ['', [Validators.required]],
      part: ['', [Validators.required, Validators.min(1)]],
      type: ['', [Validators.required]],
      recordedOn: ['', [Validators.required]],
      file: [null, [Validators.required]],
      price: ['', [Validators.required]],
    });
  }

  onNewCourseSubmit(): void {
  }

  onFileSelected(event: any): void {
    const file = (event.target as HTMLInputElement).files[0];
    this.rcForm.controls.file.patchValue(file);
    this.rcForm.controls.file.updateValueAndValidity();
  }

  public isUploadReady(): boolean {
    if (
      this.rcForm.controls.title.valid &&
      this.rcForm.controls.description.valid &&
      this.rcForm.controls.refresherCourse.valid &&
      this.rcForm.controls.part.valid &&
      this.rcForm.controls.type.valid &&
      this.rcForm.controls.recordedOn.valid
    ) {
      return true;
    }
    return false;
  }
}
