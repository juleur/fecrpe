import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { MYPROFIL_GQL, UPDATEPROFIL_GQL, MyProfilResponse, UpdateUserResponse } from './profil-gql';
import { AuthService } from './../../../core/services/auth.service';
import { Router } from '@angular/router';
import { User } from 'src/app/core';

@Component({
  selector: 'my-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit, OnDestroy {
  constructor(
    private fb: FormBuilder,
    private apollo: Apollo,
    private auth: AuthService,
    private router: Router
  ) {}
  private querySub: Subscription;
  userForm: FormGroup;
  user: User;

  ngOnInit() {
    this.userForm = this.fb.group({
      email: ['', Validators.email],
      username: ['', Validators.maxLength(3)],
      password: ['', Validators.required],
    });
    this.querySub = this.apollo.watchQuery<MyProfilResponse>({
      query: MYPROFIL_GQL,
      variables: {
        userId: this.auth.getUserIDToken()
      }
    }).valueChanges.subscribe(res => {
      if (res.errors === undefined) {
        this.user = res.data.myProfile;
        this.userForm.patchValue(this.user);
      }
    });
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
    }).subscribe(res => {
      if (res.errors === undefined) {
        for (const err of res.errors) {
          console.log(err.message);
        }
        // change mutation schema gqlgen backend
        // this.user = res.data.updateUser;
        // this.userForm.patchValue(this.user);
        console.log('updated');
      } else {
        for (const err of res.errors) {
          switch (err.extensions['statusCode']) {
            case 403:
              this.userForm.reset();
              this.userForm.patchValue(this.user);
              break;
            default:
              this.auth.deauthentication();
              this.router.navigate(['/auth/login']);
              break;
          }
        }
      }
    });
  }

  ngOnDestroy() {
    this.querySub.unsubscribe();
  }
}
