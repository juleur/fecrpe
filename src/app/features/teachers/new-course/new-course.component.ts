import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { REFRESHERCOURSE_GQL, RefresherCoursesResponse, NEWCOURSE_GQL, NewCourseResponse } from './new-course-gql';
import { Type, RefresherCourse, Section } from 'src/app/core/models';
import { AuthService } from './../../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'new-course',
  templateUrl: './new-course.component.html',
  styleUrls: ['./new-course.component.scss']
})
export class NewCourseComponent implements OnInit, OnDestroy {
  private querySub: Subscription;
  rcForm: FormGroup;
  typesCourse: string[] = Object.values(Type);
  sectionCourse: string[] = Object.values(Section);
  refresherCourses: RefresherCourse[];

  constructor(
    private fb: FormBuilder, private apollo: Apollo,
    private toast: ToastrService
  ) {}

  ngOnInit() {
    this.rcForm = this.fb.group({
      refresherCourse: ['', [Validators.required]],
      title: ['', [Validators.required, Validators.minLength(5)]],
      section: ['', [Validators.required]],
      type: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(5)]],
      sessionNumber: [null],
      recordedOn: ['', [Validators.required]],
      file: [null, [Validators.required]],
      docs: this.fb.array([]),
      price: ['', [Validators.required]],
    });
    this.querySub = this.apollo.watchQuery<RefresherCoursesResponse>({
      query: REFRESHERCOURSE_GQL,
    }).valueChanges
      .subscribe(res => {
        if (res.hasOwnProperty('errors')) {
          this.rcForm.controls.refresherCourse.disable();
        }
        this.refresherCourses = res.data.getRefresherCourses.filter(v => v.isFinished === false);
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
    this.apollo.mutate<NewCourseResponse>({
      mutation: NEWCOURSE_GQL,
      variables: {
        input: {
          refresherCourseId: this.rcForm.value.refresherCourse,
          title: this.rcForm.value.title,
          type: this.rcForm.value.type === 'leçon' ? 'LESSON' : 'EXERCISE',
          description: this.rcForm.value.description,
          part: this.rcForm.value.part,
          recordedOn: this.rcForm.value.recordedOn,
          videoFile: this.rcForm.value.file,
          // docFiles: this.rcForm.value.docs,
          price: this.rcForm.value.price
        }
      },
      context: {
        useMultipart: true
      },
    }).subscribe(v => console.log(v.data.createRefresherCourse));
  }

  onFileSelected(event: any): void {
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      this.rcForm.controls.file.patchValue(file);
      this.rcForm.controls.file.updateValueAndValidity();
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
