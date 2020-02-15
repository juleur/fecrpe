import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { PROFILE_GQL, UPDATEPROFIL_GQL, ProfileResponse, UpdateUserResponse } from './profil-gql';
import { User } from 'src/app/core';
import { ToastrService } from 'ngx-toastr';
import { AuthStatusService } from 'src/app/core/services/auth-status.service';

@Component({
  selector: 'my-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {
  constructor(
    private fb: FormBuilder, private apollo: Apollo,
    private authStatus: AuthStatusService, private toast: ToastrService,
    private router: Router
  ) {}
  userForm: FormGroup;
  user: User;

  ngOnInit() {
    this.userForm = this.fb.group({
      email: ['', Validators.email],
      username: ['', Validators.maxLength(3)],
      password: ['', Validators.required],
    });

    this.apollo.watchQuery<ProfileResponse>({
      query: PROFILE_GQL,
      variables: {
        userId: this.authStatus.getUserIDToken()
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
            case 'Token Expired':
              break;
            case 'Unauthorized':
              break;
            default:
              break;
          }
          // switch (err.extensions.statusText) {
          //   case 'Unauthorized':
          //     this.toast.error(`${err.message} !`, 'Profil', {
          //       positionClass: 'toast-top-right',
          //       timeOut: 3000
          //     });
          //     this.apollo.client.clearStore();
          //     setTimeout(() => {
          //       this.router.navigate(['/']);
          //     }, 2800);
          //     break;
          // }
        }
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
      },
    }).subscribe(({data, errors}) => {
      if (data) {
        this.user = data.updateUser;
        this.userForm.patchValue(this.user);
        this.toast.success(`${this.authStatus.getUsernameToken()} profil mis à jour`, 'Profil', {
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
              this.toast.error(`${this.authStatus.getUsernameToken()} profil n'a pu être mis à jour`, 'Profil', {
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
}
