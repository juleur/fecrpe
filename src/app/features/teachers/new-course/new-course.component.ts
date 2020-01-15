import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { REFRESHERCOURSE_GQL, RefresherCoursesResponse, NEWCOURSE_GQL, NewCourseResponse } from './new-course-gql';

import { Type, RefresherCourse } from 'src/app/core/models';
import { Apollo } from 'apollo-angular';
import { map, filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { AuthService } from './../../../core/services/auth.service';

@Component({
  selector: 'new-course',
  templateUrl: './new-course.component.html',
  styleUrls: ['./new-course.component.scss']
})
export class NewCourseComponent implements OnInit, OnDestroy {
  private querySub: Subscription;
  rcForm: FormGroup;
  typesCourse: string[] = Object.values(Type);
  refresherCourses: RefresherCourse[];

  constructor(
    private fb: FormBuilder, private apollo: Apollo,
    private auth: AuthService, private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.querySub = this.apollo.watchQuery<RefresherCoursesResponse>({
      query: REFRESHERCOURSE_GQL,
    }).valueChanges
    .subscribe(res => {
      if (res.hasOwnProperty('errors')) {
        console.log(res);
      }
      this.refresherCourses = res.data.getRefresherCourses.filter(v => v.isFinished === false && v.author.id == this.auth.getUserIDToken());
    });
    this.rcForm = this.fb.group({
      refresherCourse: ['', [Validators.required]],
      title: ['', [Validators.required, Validators.minLength(5)]],
      type: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(5)]],
      part: [''],
      recordedOn: ['', [Validators.required]],
      file: [null, [Validators.required]],
      docs: this.fb.array([]),
      price: ['', [Validators.required]],
    });

  }

  get docs(): FormArray {
    return (this.rcForm.get('docs') as FormArray);
  }

  addDocs(): void {
    this.docs.push(this.fb.group({
      title: ['', Validators.required],
      file: [null, Validators.required]
    }));
  }

  removeDocs(index: number): void {
    this.docs.removeAt(index);
  }

  onBtnAddDocs(): boolean {
    if (this.docs.controls.length === 0) {
      return false;
    } else {
      if (this.docs.controls[this.docs.length - 1].get('file').value) {
        return false;
      }
      return true;
    }
  }

  onNewCourseSubmit(): void {
    let params;
    if (this.rcForm.value.docs.length > 0) {
      params = {
        refresherCourseId: this.rcForm.value.refresherCourse,
        title: this.rcForm.value.title,
        type: this.rcForm.value.type === 'leçon' ? 'lesson' : 'exercise',
        description: this.rcForm.value.description,
        part: this.rcForm.value.part,
        recordedOn: this.rcForm.value.recordedOn,
        videoFile: this.rcForm.value.file,
        price: this.rcForm.value.price
      };
    }
    params = {
      refresherCourseId: this.rcForm.value.refresherCourse,
      title: this.rcForm.value.title,
      type: this.rcForm.value.type === 'leçon' ? 'lesson' : 'exercise',
      description: this.rcForm.value.description,
      part: this.rcForm.value.part,
      recordedOn: this.rcForm.value.recordedOn,
      videoFile: this.rcForm.value.file,
      docFiles: this.rcForm.value.docs,
      price: this.rcForm.value.price
    };
    console.log(this.rcForm.value.file);
    this.apollo.mutate<NewCourseResponse>({
      mutation: NEWCOURSE_GQL,
      variables: {
        input: params
      },
      context: {
        useMultipart: true
      },
    }).subscribe(v => console.log(v));
  }

  onFileSelected(event: any): void {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const file = (event.target as HTMLInputElement).files[0];
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.rcForm.controls.file.patchValue(reader.result);
        this.rcForm.controls.file.updateValueAndValidity();
        this.cd.markForCheck();
      };
    }
  }

  onDocFileSelected(event: any): void {
    const files = (event.target as HTMLInputElement).files;
    (this.docs.at(this.docs.length - 1) as FormGroup).controls.file.patchValue(files[0]);
  }

  public isUploadReady(): boolean {
    if (
      this.rcForm.controls.title.valid &&
      this.rcForm.controls.description.valid &&
      this.rcForm.controls.refresherCourse.valid &&
      this.rcForm.controls.type.valid &&
      this.rcForm.controls.recordedOn.valid
    ) {
      return true;
    }
    return false;
  }

  ngOnDestroy() {
    this.querySub.unsubscribe();
  }
}
