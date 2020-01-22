import { ValidatorFn, ValidationErrors, FormGroup } from '@angular/forms';

export const matchPasswordValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const password = control.get('password');
  const confirPassword = control.get('c_password');
  return password && confirPassword && password.value !== confirPassword.value ? { matchPassword: true } : null;
};
