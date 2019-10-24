import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Apollo } from 'apollo-angular';

import { UploadVideoGQL } from '../../../core/graphql/mutations/upload-video-gql';
import { TeacherCoursesGQL } from '../../../core/graphql/queries/teacher-courses-gql';
import { Subject, Type, RefresherCourse, FileUploaderService } from 'src/app/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { HttpEvent, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'new-course',
  templateUrl: './new-course.component.html',
  styleUrls: ['./new-course.component.scss']
})
export class NewCourseComponent implements OnInit {
  rcForm: FormGroup;
  typesCourse: string[] = Object.values(Type);
  // RefresherCourse that aren't finished
  refresherCourses: RefresherCourse[] = [
    {id: 1, subject: {id: 1, name: 'Mathématique'}},
    {id: 2, subject: {id: 5, name: 'Français'}}
  ];
  progressUpload = 0;
  uploadDoneMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private fileUploader: FileUploaderService
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
      docs: this.fb.array([]),
      price: ['', [Validators.required]],
    });
  }

  addDocs(): void {
    const docs = this.rcForm.controls.docs as FormArray;
    docs.push(this.fb.group({
      title: ['', Validators.required],
      file: [null, Validators.required]
    }));
  }

  removeDocs(index: number): void {
    const docs = this.rcForm.controls.docs as FormArray;
    docs.removeAt(index);
  }

  onBtnAddDocs(): boolean {
    const docs = this.rcForm.controls.docs as FormArray;
    if (docs.controls.length === 0) {
      return false;
    } else {
      if (docs.controls[docs.length - 1].get('file').value) {
        return false;
      }
      return true;
    }
  }

  onNewCourseSubmit(): void {
    this.fileUploader.addFile(this.rcForm).subscribe(
      (event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            this.progressUpload = Math.round(event.loaded / event.total * 100);
            break;
          case HttpEventType.Response:
            this.uploadDoneMessage = this.uploadDoneMessage + 'Chargement terminé. Votre cours sera immédiatement mis en ligne après le traitement effectué';
            setTimeout(() => {
              this.progressUpload = 0;
              this.uploadDoneMessage = '';
            }, 2000);
            break;
        }
      },
      (error: string) => {
        this.errorMessage = this.errorMessage + error;
        this.rcForm.reset();
      }
    );
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
