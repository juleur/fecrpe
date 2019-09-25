import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { MyProfilGQL } from 'src/app/core/graphql/queries/my-profil-gql';
import { UpdateProfilGQL } from 'src/app/core/graphql/mutations/update-profil-gql';
import { User } from 'src/app/core';

@Component({
  selector: 'my-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {
  userForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private myProfilGQL: MyProfilGQL,
    private updateProfilGQL: UpdateProfilGQL
  ) { }

  ngOnInit() {
    this.userForm = this.fb.group({
      email: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
    this.myProfilGQL.watch().valueChanges.pipe(
      tap(res => this.userForm.patchValue(res.data.user)),
      catchError(err => of(err))
    );
  }

  onUpdateUser(): void {
    // add jwt service to get token and decode it
    this.updateProfilGQL.mutate({
      userId: 14312545343
    }).pipe(
      tap(res => this.userForm.patchValue(res.data.user)),
      catchError(err => of(err))
    );
  }
}
