import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { timer, interval, Subject } from 'rxjs';
import { switchMap, take, takeUntil, repeatWhen } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';
import { ToastrService } from 'ngx-toastr';
import videojs from 'video.js';

import { Session } from './../../../core/models/session.model';
import { Video, User } from 'src/app/core';
import { ClassPaper } from 'src/app/core/models/class-paper.model';
import { PLAYERCHECKUSER, PlayerCheckUserResponse } from './session-gql';

@Component({
    selector: 'session-players',
    templateUrl: './session-players.component.html',
    styleUrls: ['./session-players.component.scss']
})
export class SessionPlayersComponent implements OnInit, AfterViewInit, OnDestroy {
    session: Session;
    video: Video;
    classPapers: ClassPaper[];
    teacher: User;
    vjs: videojs.Player;
    private readonly _STOP = new Subject<void>();
    private readonly _START = new Subject<void>();

    constructor(
        private activatedRoute: ActivatedRoute, private toast: ToastrService,
        private apollo: Apollo, private router: Router
    ) {
        // this.activatedRoute.data.subscribe(res => {
        //     if (res.sessionPlayers.data) {
        //         this.session = res.sessionPlayers.data.sessionCourse.session;
        //         this.video = res.sessionPlayers.data.sessionCourse.video;
        //         this.classPapers = res.sessionPlayers.data.sessionCourse.classPapers;
        //         this.teacher = res.sessionPlayers.data.sessionCourse.teacher;
        //     }
        //     if (res.sessionPlayers.errors) {
        //         for (const err of res.course.errors) {
        //             switch (err.extensions.statusText) {
        //                 case 'Forbidden':
        //                     this.toast.warning(`${err.message}`, 'Session vidéo', {
        //                         positionClass: 'toast-top-full-width',
        //                         timeOut: 3000
        //                     });
        //                     break;
        //                 case 'Internal Server Error':
        //                     this.toast.error(`${err.message}`, 'Session vidéo', {
        //                         positionClass: 'toast-top-full-width',
        //                         timeOut: 3000
        //                     });
        //                     break;
        //             }
        //         }
        //     }
        // });
    }

    ngOnInit() {
        interval(3000).pipe(
            switchMap(() => this.apollo.query<PlayerCheckUserResponse>({
                query: PLAYERCHECKUSER,
                fetchPolicy: 'no-cache'
            })),
            takeUntil(this._STOP),
            repeatWhen(() => this._START),
        ).subscribe(({ errors }) => {
            if (errors) {
                this._STOP.next();
                for (const err of errors) {
                    this.toast.warning(`${err.message}`, 'Multi-compte', {
                        positionClass: 'toast-top-full-width',
                        timeOut: 5000
                    });
                    this.router.navigate(['/formations/courses', this.activatedRoute.snapshot.paramMap.get('id')]);
                }
            }
        });
        interval(1000).pipe(take(1)).subscribe(_ => {
            this._STOP.next()
        });
    }

    ngAfterViewInit() {
        const options = {
            sources: [{
                src: 'http://localhost:8081/player/mathetimatics/2020/rc/session-34/video.714930560.mpd',
                type: 'application/dash+xml',
            }],
            // sources: [{
            //     src: 'http://localhost:8180/player/mathetimatics/2020/rc/session-34/video.714930560-video-avc1.mp4',
            //     type: 'video/mp4'
            // }]
        };
        this.vjs = videojs('my-player', options);

        this.vjs.on('play', () => {
            this._START.next();
        });
        this.vjs.on('pause', () => {
            this._STOP.next()
        });
    }

    ngOnDestroy() {
        if (this.vjs) {
            this.vjs.dispose();
        }
    }
}
