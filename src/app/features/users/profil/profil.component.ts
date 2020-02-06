import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { PROFILE_GQL, UPDATEPROFIL_GQL, ProfileResponse, UpdateUserResponse } from './profil-gql';
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
    private fb: FormBuilder, private apollo: Apollo,
    private auth: AuthService, private toast: ToastrService,
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
      this.querySub = this.apollo.watchQuery<ProfileResponse>({
        query: PROFILE_GQL,
        variables: {
          userId: this.auth.getUserIDToken()
        },
        fetchPolicy: 'cache-and-network'
      }).valueChanges.subscribe(({data, errors}) => {
        if (data) {
          this.user = data.profile;
          this.userForm.patchValue(this.user);
        }
        if (errors) {
          for (const err of errors) {
            switch (err.extensions.statusText) {
              case 'Unauthorized':
                this.toast.error(`${err.message} !`, 'Profil', {
                  positionClass: 'toast-top-right',
                  timeOut: 3000
                });
                this.apollo.client.clearStore();
                setTimeout(() => {
                  this.router.navigate(['/']);
                }, 2800);
                break;
            }
          }
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
    }).subscribe(({data, errors}) => {
      if (data) {
        this.user = data.updateUser;
        this.userForm.patchValue(this.user);
        this.toast.success(`${this.auth.getUsernameToken()} profil mis à jour`, 'Profil', {
          positionClass: 'toast-top-right',
          timeOut: 3000
        });
      }
      if (errors) {
        for (const err of errors) {
          switch (err.extensions.statusText) {
            case 'Forbidden':
              this.toast.error(`${err.message}`, 'Profil', {
                positionClass: 'toast-top-right',
                timeOut: 3000
              });
              break;
            default:
              this.toast.error(`${this.auth.getUsernameToken()} profil n'a pu être mis à jour`, 'Profil', {
                positionClass: 'toast-top-right',
                timeOut: 3000
              });
              break;
          }
          this.userForm.reset();
          this.userForm.patchValue(this.user);
        }
      }
    });
  }

  ngOnDestroy() {
    this.querySub.unsubscribe();
  }
}
