import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../../services';

@Component({
  selector: 'top',
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopComponent implements OnInit {
  isLoggedIn$: Observable<boolean>;

  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.isLoggedIn$ = this.auth.isLoggedIn();
  }
}
