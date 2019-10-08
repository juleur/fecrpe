import { Component, OnInit, Input } from '@angular/core';
import { RefresherCourse } from 'src/app/core/models/refresher-course.model';

@Component({
  selector: 'course-card',
  templateUrl: './course-card.component.html',
  styleUrls: ['./course-card.component.scss']
})
export class CourseCardComponent implements OnInit {
  @Input() refresherCourse: RefresherCourse;

  constructor() { }

  ngOnInit() {
  }
}
