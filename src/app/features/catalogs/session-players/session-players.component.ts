import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { DashjsPlyrDriver } from '../utils/dashjs-plyr-driver/dashjs-plyr-driver';
import Plyr from 'plyr';
import { Session } from './../../../core/models/session.model';
import { SESSION_GQL, SessionResponse } from './session-gql';

@Component({
  selector: 'session-players',
  templateUrl: './session-players.component.html',
  styleUrls: ['./session-players.component.scss']
})
export class SessionPlayersComponent implements OnInit, OnDestroy {
  options: Plyr.Options = {
    clickToPlay: true,
    hideControls: true,
    settings: ['speed'],
    speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] },
    fullscreen: {enabled: true, fallback: true, iosNative: false},
  };
  sources: Plyr.Source[] = [{
    type: 'video',
    // src: 'https://bitmovin-a.akamaihd.net/content/MI201109210084_1/mpds/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.mpd'
    src: 'http://localhost:4039/player/video/video4432.mpd'
  }];
  dashjsDriver = new DashjsPlyrDriver(true);

  private querySub: Subscription;
  private sessionID: number;
  session: Session;

  constructor(private apollo: Apollo, private route: ActivatedRoute) {
    this.sessionID = this.route.snapshot.params.vid;
  }

  ngOnInit() {
    // this.querySub = this.apollo.watchQuery<SessionResponse>({
    //   query: SESSION_GQL,
    //   variables: {
    //     sessionId: this.sessionID
    //   }
    // }).valueChanges.subscribe(res => {
    //   if (res.hasOwnProperty('errors')) {
    //     console.log(res.errors);
    //   } else {
    //     this.session = res.data.getSessionCourse;
    //     this.poster = 'https://img.favpng.com/11/16/16/computer-icons-youtube-play-button-clip-art-png-favpng-1pNUNHSAxSxc1FMHD6MXS3UEM.jpg';
    //     // this.sources[0] = {
    //     //   type: 'video',
    //     //   // src: 'https://bitmovin-a.akamaihd.net/content/MI201109210084_1/mpds/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.mpd'
    //     //   src: 'http://localhost:4039/player/video/testmp4_dash.mpd'
    //     // };
    //   }
    // });
  }

  ngOnDestroy() {
    this.querySub.unsubscribe();
  }
}
