import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  public isTeacherSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);

  isTeacher$ = this.isTeacherSubject.asObservable();

  constructor() {}

  isTeacher(): boolean {
    return this.isTeacherSubject.getValue();
  }
}
