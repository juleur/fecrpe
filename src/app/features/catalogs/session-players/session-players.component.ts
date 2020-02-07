import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { timer, Subject } from 'rxjs';
import { switchMap, takeUntil, repeatWhen } from 'rxjs/operators';

import { DashjsPlyrDriver } from '../utils/dashjs-plyr-driver/dashjs-plyr-driver';
import Plyr from 'plyr';
import { PlyrComponent } from 'ngx-plyr';
import { Session } from './../../../core/models/session.model';
import { Video, User } from 'src/app/core';
import { ClassPaper } from 'src/app/core/models/class-paper.model';
import { ToastrService } from 'ngx-toastr';
import { Apollo } from 'apollo-angular';
import { PLAYERCHECKUSER, PlayerCheckUserResponse } from './session-gql';

@Component({
  selector: 'session-players',
  templateUrl: './session-players.component.html',
  styleUrls: ['./session-players.component.scss']
})
export class SessionPlayersComponent implements OnInit {
  @ViewChild(PlyrComponent) plyr: PlyrComponent;
  dashjsDriver = new DashjsPlyrDriver(true);
  player: Plyr;
  options: Plyr.Options = {
    clickToPlay: true,
    hideControls: true,
    settings: ['speed'],
    speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] },
    fullscreen: {enabled: true, fallback: true, iosNative: false},
  };
  sources: Plyr.Source[] = [];
  private serverFileURL = 'http://localhost:4039/player';

  session: Session;
  video: Video;
  classPapers: ClassPaper[];
  teacher: User;
  private readonly _STOP = new Subject<void>();
  private readonly _START = new Subject<void>();

  constructor(private activatedRoute: ActivatedRoute, private toast: ToastrService, private apollo: Apollo) {
    this.activatedRoute.data.subscribe(res => {
      if (res.sessionPlayers.data) {
        this.session = res.sessionPlayers.data.sessionCourse.session;
        this.video = res.sessionPlayers.data.sessionCourse.video;
        this.classPapers = res.sessionPlayers.data.sessionCourse.classPapers;
        this.teacher = res.sessionPlayers.data.sessionCourse.teacher;
      }
      if (res.sessionPlayers.errors) {
        for (const err of res.course.errors) {
          switch (err.extensions.statusText) {
            case 'Forbidden':
              this.toast.warning(`${err.message}`, 'Session vidéo', {
                positionClass: 'toast-top-full-width',
                timeOut: 3000
              });
              break;
            case 'Internal Server Error':
              this.toast.error(`${err.message}`, 'Session vidéo', {
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
    this.sources[0] = {
      type: 'video',
      src: this.serverFileURL.concat('', `${this.video.path}`)
    };
    timer(2 * 1000, 1000).pipe(
      switchMap(() => this.apollo.query<PlayerCheckUserResponse>({
        query: PLAYERCHECKUSER,
        fetchPolicy: 'no-cache'
      })),
      repeatWhen(() => this._START),
      takeUntil(this._STOP),
    ).subscribe(({errors}) => {
      if (errors) {
        this._STOP.next();
        for (const err of errors) {
          this.toast.warning(`${err.message}`, '', {
            positionClass: 'toast-top-full-width',
            timeOut: 5000
          });
        }
      }
    });
  }

  played(event: Plyr.PlyrEvent): void {
    this._START.next();
  }

  paused(event: Plyr.PlyrEvent): void {
    this._STOP.next();
  }

  ended(event: Plyr.PlyrEvent): void {
    this._STOP.next();
  }
}
