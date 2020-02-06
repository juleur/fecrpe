import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { REFRESHERSCOURSE_GQL, RefresherCoursesResponse, NEWCOURSE_GQL, NewCourseResponse } from './new-course-gql';
import { RefresherCourse } from 'src/app/core/models';
import { TypeEnum, SectionEnum, SubjectEnum } from './../../../core/models/enums.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'new-course',
  templateUrl: './new-course.component.html',
  styleUrls: ['./new-course.component.scss']
})
export class NewCourseComponent implements OnInit, OnDestroy {
  @ViewChild('videoFileInput') videoFileInputRef: ElementRef;
  private querySub: Subscription;
  rcForm: FormGroup;
  typesCourse: string[] = Object.values(TypeEnum);
  sectionsCourse: string[] = Object.values(SectionEnum);
  refresherCourses: RefresherCourse[];
  loading = false ;

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
    });
    this.querySub = this.apollo.watchQuery<RefresherCoursesResponse>({
      query: REFRESHERSCOURSE_GQL,
      variables: {
        input: {}
      },
      fetchPolicy: 'no-cache'
    }).valueChanges.subscribe(({data, loading, errors}) => {
      if (loading) {
        this.rcForm.disable();
      }
      if (data) {
        this.refresherCourses = data.refresherCourses.filter(rc => rc.isFinished === false);
        if (this.refresherCourses.length === 0) {
          this.rcForm.disable();
        } else {
          this.refresherCourses = this.refresherCourses.filter(rc => {
            for (const k of Object.keys(SubjectEnum)) {
              if (rc.subject === k) {
                rc.subject = SubjectEnum[k];
                return rc;
              }
            }
          });
        }
      }
      if (errors) {
        this.rcForm.disable();
        for (const err of errors) {
          this.toast.error(`${err.message}`, 'Création de cours', {
            positionClass: 'toast-top-full-width',
            timeOut: 4000
          });
        }
      }
    });
  }

  get docs(): FormArray {
    return (this.rcForm.get('docs') as FormArray);
  }

  addDocs(): void {
    this.docs.push(this.fb.group({
      title: [''],
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
    this.loading = true;
    console.log(this.loading);
    this.apollo.mutate<NewCourseResponse>({
      mutation: NEWCOURSE_GQL,
      variables: {
        input: {
          refresherCourseId: this.rcForm.value.refresherCourse,
          title: this.rcForm.value.title,
          section: this.rcForm.value.section === 'Scientifique' ? 'SCIENTIFIC' : 'DIALECTICAL',
          type: this.rcForm.value.type === 'leçon' ? 'LESSON' : 'EXERCISE',
          description: this.rcForm.value.description,
          sessionNumber: this.rcForm.value.sessionNumber,
          recordedOn: this.rcForm.value.recordedOn,
          videoFile: this.rcForm.value.file,
          docFiles: this.rcForm.value.docs,
        }
      },
      context: {
        useMultipart: true
      },
    }).subscribe(({data, errors}) => {
      if (data) {
        this.toast.success('Le cours a bien été enregistré. Il sera automatiquement mis en ligne dès la fin du traitement video.', 'Création de cours', {
          positionClass: 'toast-top-full-width',
          timeOut: 3000
        });
        this.videoFileInputRef.nativeElement.value = '';
        for (const i of Array(this.docs.length).keys()) {
          this.docs.removeAt(i);
        }
        this.rcForm.reset();
        Object.keys(this.rcForm.controls).forEach(key => {
          this.rcForm.controls[key].clearValidators();
          this.rcForm.controls[key].updateValueAndValidity();
        });
      }
      if (errors) {
        for (const err of errors) {
          this.toast.error(`${err.message}`, 'Création de cours', {
            positionClass: 'toast-top-full-width',
            timeOut: 5000
          });
        }
      }
      this.loading = false;
    });
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
      this.rcForm.controls.section.valid &&
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
