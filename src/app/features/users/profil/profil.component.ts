import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { MYPROFIL_GQL, UPDATEPROFIL_GQL, MyProfilResponse, UpdateUserResponse } from './profil-gql';
import { AuthService } from './../../../core/services/auth.service';

@Component({
  selector: 'my-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit, OnDestroy {
  constructor(private fb: FormBuilder, private apollo: Apollo, private auth: AuthService) { }
  private querySub: Subscription;
  userForm: FormGroup;

  ngOnInit() {
    this.userForm = this.fb.group({
      email: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
    this.querySub = this.apollo.watchQuery<MyProfilResponse>({
      query: MYPROFIL_GQL,
      variables: {
        userId: this.auth.getUserIDToken()
      }
    }).valueChanges.subscribe(
      res => this.userForm.patchValue(res.data.myProfile),
    //   err => console.log(err),
    );
  }

  onUpdateUser(): void {
    this.apollo.mutate<UpdateUserResponse>({
      mutation: UPDATEPROFIL_GQL,
      variables: {
        input: {
          username: this.userForm.value.username,
          email: this.userForm.value.email,
          password: this.userForm.value.password
        }
      }
    }).subscribe(
      // res => console.log(res.data.updateUser),
      // err => console.log(err)
    );
  }

  ngOnDestroy() {
    this.querySub.unsubscribe();
  }
}
