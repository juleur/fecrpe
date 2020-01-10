import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';
import { MYPROFIL_GQL, UPDATEPROFIL_GQL, MyProfilResponse, UpdateUserResponse } from './profil-gql';
import { AuthService } from './../../../core/services/auth.service';
import { User } from 'src/app/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import * as Cookies from 'js-cookie';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

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
    private toast: ToastrService,
    private router: Router
    ) {}
  private querySub: Subscription;
  private jwtHelper = new JwtHelperService();
  userForm: FormGroup;
  user: User;

  ngOnInit() {
    this.userForm = this.fb.group({
      email: ['', Validators.email],
      username: ['', Validators.maxLength(3)],
      password: ['', Validators.required],
    });
    if (
      this.jwtHelper.decodeToken(Cookies.get('access_token')) != null &&
      !this.jwtHelper.isTokenExpired(Cookies.get('access_token'))
    ) {
      this.querySub = this.apollo.watchQuery<MyProfilResponse>({
        query: MYPROFIL_GQL,
        variables: {
          userId: this.auth.getUserIDToken()
        },
      }).valueChanges.subscribe(res => {
        if (res.hasOwnProperty('errors')) {
          for (const err of res.errors) {
            switch (err.extensions.statusText) {
              case 'Unauthorized':
                this.toast.error(`${err.message} !`, 'Profil', {
                  positionClass: 'toast-top-right',
                  timeOut: 3000
                });
                Cookies.remove('access_token');
                Cookies.remove('refresh_token');
                this.apollo.client.clearStore();
                setTimeout(() => {
                  this.router.navigate(['/']);
                }, 2800);
                break;
            }
          }
        } else {
          this.user = res.data.myProfile;
          this.userForm.patchValue(this.user);
        }
      });
    }
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
      },
    }).pipe(
      tap(res => {
        if (res.data === undefined && res.data === null) {
          for (const err of res.errors) {
            switch (err.extensions.statusText) {
              default:
                this.userForm.reset();
                this.userForm.patchValue(this.user);
                this.toast.error(`${this.auth.getUsernameToken()} profil n'a pu être mis à jour`, 'Profil', {
                  positionClass: 'toast-top-right',
                  timeOut: 3000
                });
                break;
            }
          }
        } else {
          // change mutation schema gqlgen backend
          // this.user = res.data.updateUser;
          // this.userForm.patchValue(this.user);
          console.log('updated');
          this.toast.success(`${this.auth.getUsernameToken()} profil mis à jour`, 'Profil', {
            positionClass: 'toast-top-right',
            timeOut: 3000
          });
        }
      })
    );
  }

  ngOnDestroy() {
    this.querySub.unsubscribe();
  }
}
