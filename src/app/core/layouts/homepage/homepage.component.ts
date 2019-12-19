import {Observable} from '@apollo/client/core';
import { Component, OnInit } from '@angular/core';

import { of } from 'zen-observable';

@Component({
  selector: 'homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
  totalHours$: Observable<number>;
  subjects$: Observable<string[]>;
  
  constructor() { }

  ngOnInit() {
    this.totalHours$ = Observable.of<number>(500);
    this.subjects$ = Observable.of<string[]>(
      ['Maths', 'Français', 'Economie']
    );
  }
}
