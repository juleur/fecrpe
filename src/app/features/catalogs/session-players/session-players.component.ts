import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { DashjsPlyrDriver } from '../utils/dashjs-plyr-driver/dashjs-plyr-driver';
import Plyr from 'plyr';

import { SessionGQL } from 'src/app/core/graphql/queries/session-gql';
import { Session, Video } from 'src/app/core';

@Component({
  selector: 'session-players',
  templateUrl: './session-players.component.html',
  styleUrls: ['./session-players.component.scss']
})
export class SessionPlayersComponent implements OnInit {
  options: Plyr.Options = {
    autoplay: true,
    hideControls: true,
    settings: ['speed', 'quality'],
    quality: { default: 360, options: [720, 480, 360]}
  };
  poster = 'https://bitdash-a.akamaihd.net/content/sintel/poster.png';
  sources: Plyr.Source[] = [{
    type: 'video',
    src: 'https://bitmovin-a.akamaihd.net/content/sintel/sintel.mpd'
  }];
  dashjsDriver = new DashjsPlyrDriver(true);

  session: Observable<Session>;
  video: Observable<Video>;

  constructor(private sessionGQL: SessionGQL) { }

  ngOnInit() {
    this.sessionGQL.watch().valueChanges.pipe(
      tap(result => {
        this.session = of<Session>(result.data.session);
        this.video = of<Video>(result.data.video);
      }),
      catchError(err => of(err))
    );
  }
}
