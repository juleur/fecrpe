import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DashjsPlyrDriver } from '../utils/dashjs-plyr-driver/dashjs-plyr-driver';
import Plyr from 'plyr';

import { Session } from './../../../core/models/session.model';
import { Apollo } from 'apollo-angular';
import { SESSION_GQL, SessionResponse } from './session-gql';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'session-players',
  templateUrl: './session-players.component.html',
  styleUrls: ['./session-players.component.scss']
})
export class SessionPlayersComponent implements OnInit, OnDestroy {
  options: Plyr.Options = {
    autoplay: true,
    hideControls: true,
    settings: ['speed', 'quality'],
    quality: { default: 360, options: [720, 480, 360]}
  };
  poster: string;
  sources: Plyr.Source[] = [];
  dashjsDriver = new DashjsPlyrDriver(true);

  private querySub: Subscription;
  private sessionID: number;
  session: Session;

  constructor(private apollo: Apollo, private route: ActivatedRoute) {
    this.sessionID = this.route.snapshot.params.vid;
  }

  ngOnInit() {
    this.querySub = this.apollo.watchQuery<SessionResponse>({
      query: SESSION_GQL,
      variables: {
        sessionId: this.sessionID
      }
    }).valueChanges.subscribe(res => {
      if (res.hasOwnProperty('errors')) {
        console.log(res.errors);
      } else {
        this.session = res.data.getSessionCourse;
        this.poster = 'https://img.favpng.com/11/16/16/computer-icons-youtube-play-button-clip-art-png-favpng-1pNUNHSAxSxc1FMHD6MXS3UEM.jpg';
        this.sources.push({
          type: 'video',
          src: 'https://bitmovin-a.akamaihd.net/content/MI201109210084_1/mpds/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.mpd'
        });
      }
    });
  }

  ngOnDestroy() {
    this.querySub.unsubscribe();
  }
}
