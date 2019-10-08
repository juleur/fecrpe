import { Component } from '@angular/core';
import { AuthService } from '../../services';

@Component({
  selector: 'top',
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.scss']
})
export class TopComponent {
  constructor(private auth: AuthService) {}
}
