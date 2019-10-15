import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, Router } from '@angular/router';

import { TeacherService } from '../services/teacher.service';

@Injectable({
  providedIn: 'root'
})
export class TeacherGuard implements CanLoad {
  constructor(
    private teacherService: TeacherService,
    private router: Router
  ) {}

  canLoad(route: Route, segments: UrlSegment[]): boolean {
    if (this.teacherService.isTeacher()) {
      return true;
    }
    this.router.navigate(['/auth/login']);
    return true;
  }
}
