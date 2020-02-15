import { Injectable } from '@angular/core';
import { AuthStatusService } from './auth-status.service';

@Injectable()
export class AuthProcessService {

  constructor(private authStatus: AuthStatusService) { }
}
