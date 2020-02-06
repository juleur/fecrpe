import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
  subjects: string[];
  totalHours: string;

  constructor(private activatedRoute: ActivatedRoute) {
    this.activatedRoute.data.subscribe(res => {
      this.subjects = res.homepage.data.subjectsEnum;
      this.totalHours = res.homepage.data.totalHoursCourses;
    });
  }

  ngOnInit() {
  }
}
