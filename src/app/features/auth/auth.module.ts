import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AuthRoutingModule } from './auth-routing.module';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

@NgModule({
  declarations: [
    LoginComponent, SignupComponent
  ],
  imports: [
    CommonModule, AuthRoutingModule,
    ReactiveFormsModule, FormsModule,
  ],
  exports: [
    LoginComponent, SignupComponent
  ]
})
export class AuthModule { }
