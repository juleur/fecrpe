import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services';

@Component({
  selector: 'top',
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.scss']
})
export class TopComponent implements OnInit {

  constructor(private auth: AuthService) { }

  ngOnInit() {
  }
}
