import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import * as shaka from 'shaka-player';
import { SessionGQL } from 'src/app/core/graphql/queries/session-gql';
import { Session, Video } from 'src/app/core';

@Component({
  selector: 'session-players',
  templateUrl: './session-players.component.html',
  styleUrls: ['./session-players.component.scss']
})
export class SessionPlayersComponent implements OnInit, AfterViewInit {
  @ViewChild('videoPlayer', {static: false}) videoElementRef: ElementRef;
  videoElement: HTMLVideoElement;
  // remove this variable then pass video.path to shaka player
  manifestUri = 'https://storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd';
  session: Observable<Session>;
  video: Observable<Video>;

  constructor(
    private sessionGQL: SessionGQL
    ) { }

  ngOnInit() {
    this.sessionGQL.watch().valueChanges.pipe(
      tap(result => {
        this.session = of<Session>(result.data.session);
        this.video = of<Video>(result.data.video);
      }),
      catchError(err => of(err))
    );
  }

  ngAfterViewInit() {
    // Install built-in polyfills to patch browser incompatibilities.
    shaka.polyfill.installAll();

    // Check to see if the browser supports the basic APIs Shaka needs.
    if (shaka.Player.isBrowserSupported()) {
      // Everything looks good!
      this.videoElement = this.videoElementRef.nativeElement;
      this.initPlayer();
    } else {
      // This browser does not have the minimum set of APIs we need.
      console.error('Browser not supported!');
    }
  }

  private initPlayer() {
    // Create a Player instance.
    // var video = document.getElementById('video');
    const player = new shaka.Player(this.videoElement);

    // Attach player to the window to make it easy to access in the JS console.
    // window.player = player;

    // Listen for error events.
    player.addEventListener('error', this.onErrorEvent);

    // Try to load a manifest.
    // This is an asynchronous process.
    player.load(this.manifestUri).then(() => {
      // This runs if the asynchronous load is successful.
      console.log('The video has now been loaded!');
    }).catch(this.onError);  // onError is executed if the asynchronous load fails.
  }

  private onErrorEvent(event) {
    // Extract the shaka.util.Error object from the event.
    this.onError(event.detail);
  }

  private onError(error) {
    // Log the error.
    console.error('Error code', error.code, 'object', error);
  }
}
