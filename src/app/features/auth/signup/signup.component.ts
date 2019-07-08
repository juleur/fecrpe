import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.registerForm = this.fb.group({
      email: ['', Validators.required],
      username: [''],
      password: ['', Validators.required],
      c_password: ['', Validators.required],
    });
  }

  onRegister(): void {
    console.log(this.registerForm.value);
  }
}
