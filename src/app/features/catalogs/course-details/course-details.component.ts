import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { map, tap } from 'rxjs/operators';
import { RefresherCourse } from './../../../core/models/refresher-course.model';
import { AuthService } from './../../../core/services/auth.service';
import { COURSEDETAILS_GQL, CourseDetailsResponse } from './course-details-gql';
import { Apollo } from 'apollo-angular';
import { ToastrService } from 'ngx-toastr';

declare var paypal;

@Component({
  selector: 'course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.scss'],
})
export class CourseDetailsComponent implements OnInit {
  @ViewChild('paypalButton') set paypalButton(element: ElementRef) {
    if (element) {
      this.priceRefCourse = 10;
      paypal
        .Buttons({
          style: { color: 'blue', shape: 'rect', label: 'pay', size: 'medium', layout: 'horizontal', tagline: 'true' },
          createOrder: (_, actions: any) => {
            return actions.order.create({
              purchase_units: [
                {
                  description: 'Simple test',
                  amount: {
                    currency_code: 'EUR',
                    value: this.priceRefCourse,
                  },
                },
              ]
            });
          },
          onApprove: async (data: any, actions: any) => {
            const order = await actions.order.capture();
          },
          onError: (err: Error) => {
            this.toast.error(`${err.message}`, 'Paiement Paypal', {
              positionClass: 'toast-top-full-width',
              timeOut: 3000
            });
          }
        })
        .render(element.nativeElement);
    }
  }

  private refCourseID: number;
  isUserLoggedIn$: Observable<boolean>;
  refresherCourse$: Observable<RefresherCourse>;
  private priceRefCourse: number;

  constructor(
    private auth: AuthService, private apollo: Apollo,
    private toast: ToastrService, private route: ActivatedRoute,
  ) {
    this.isUserLoggedIn$ = this.auth.isLoggedIn$;
    this.refCourseID = this.route.snapshot.params.id;
  }

  ngOnInit() {
    this.refresherCourse$ = this.apollo.watchQuery<CourseDetailsResponse>({
      query: COURSEDETAILS_GQL,
      variables: {
        refresherCourseId: this.refCourseID
      }
    }).valueChanges.pipe(
      tap(res => {
        if (res.hasOwnProperty('errors')) {
          for (const err of res.errors) {
            switch (err.extensions.statusText) {
              case 'Not Found':
                this.toast.warning(`${err.message} !`, 'Remise à niveau', {
                  positionClass: 'toast-top-right',
                  timeOut: 2000
                });
                break;
              case 'Internal Server Error':
                this.toast.error(`${err.message} !`, 'Remise à niveau', {
                  positionClass: 'toast-top-right',
                  timeOut: 2000
                });
            }
          }
        }
      }),
      map(res => res.data.getRefresherCourse),
      tap(res => this.priceRefCourse = res.price)
    );
  }
}
