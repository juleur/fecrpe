import { Component, OnInit } from '@angular/core';
import { RefresherCourse } from 'src/app/core';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {
  refresherCourses: RefresherCourse[];

  constructor(private toast: ToastrService, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.data.subscribe(res => {
      if (res.courses.data) {
        this.refresherCourses = res.courses.data.refresherCourses;
      }
      if (res.courses.data.errors) {
        for (const err of res.course.errors) {
          switch (err.extensions.statusText) {
            case 'Not Found':
              this.toast.warning(`${err.message}`, 'Cours', {
                positionClass: 'toast-top-full-width',
                timeOut: 3000
              });
              break;
            case 'Internal Server Error':
              this.toast.error(`${err.message}`, 'Cours', {
                positionClass: 'toast-top-full-width',
                timeOut: 3000
              });
              break;
          }
        }
      }
    });
  }

  ngOnInit() {
  }
}
