import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { map, tap } from 'rxjs/operators';
import { RefresherCourse } from './../../../core/models/refresher-course.model';
import { AuthService } from './../../../core/services/auth.service';
import { COURSEDETAILS_GQL, CourseDetailsResponse, PURCHASEREFCOURSE_GQL, PurchaseRefCourseResponse } from './course-details-gql';
import { Apollo } from 'apollo-angular';
import { ToastrService } from 'ngx-toastr';
import { MyRefresherCoursesResponse } from '../../users/courses/my-courses-gql';

declare var paypal;

@Component({
  selector: 'course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.scss'],
})
export class CourseDetailsComponent implements OnInit, OnDestroy {
  @ViewChild('paypalButton') set paypalButton(element: ElementRef) {
    if (element) {
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
                    value: this.refresherCourse.price,
                  },
                },
              ]
            });
          },
          onApprove: async (_, actions: any) => {
            const order = await actions.order.capture();
            this.addOrder(order);
          },
          onError: (err: Error) => {
            this.toast.error(`${err.message}`, 'Paiement Paypal Refusé', {
              positionClass: 'toast-top-full-width',
              timeOut: 5000
            });
          }
        })
        .render(element.nativeElement);
    }
  }
  private querySub: Subscription;
  private refCourseRouteID: number;
  isUserLoggedIn$: Observable<boolean>;
  refresherCourse: RefresherCourse;

  constructor(
    private auth: AuthService, private apollo: Apollo,
    private toast: ToastrService, private route: ActivatedRoute,
  ) {
    this.isUserLoggedIn$ = this.auth.isLoggedIn$;
    this.refCourseRouteID = this.route.snapshot.params.id;
  }

  ngOnInit() {
    this.querySub = this.apollo.watchQuery<CourseDetailsResponse>({
      query: COURSEDETAILS_GQL,
      variables: {
        refresherCourseId: this.refCourseRouteID
      },
      fetchPolicy: 'cache-and-network'
    }).valueChanges.subscribe(res => {
      if (res.hasOwnProperty('errors')) {
        for (const err of res.errors) {
          this.toast.error(`${err.message} !`, 'Remise à niveau', {
            positionClass: 'toast-top-right',
            timeOut: 5000
          });
        }
      }
      if (res.data !== undefined || res.data !== null) {
        this.refresherCourse = res.data.getRefresherCourse;
      }
    });
  }

  private addOrder(order: any): void {
    this.apollo.mutate<PurchaseRefCourseResponse>({
      mutation: PURCHASEREFCOURSE_GQL,
      variables: {
        input: {
          refresherCourseId: this.refresherCourse.id,
          paypalOrderId: order.id,
          paypalPayerId: order.payer.payer_id,
        }
      }
    }).subscribe(res => {
      if (res.hasOwnProperty('errors')) {
        for (const err of res.errors) {
          this.toast.error(`${err.message}`, 'Paiement Refusé', {
            positionClass: 'toast-top-full-width',
            timeOut: 5000
          });
        }
      }
      if (res.data !== undefined || res.data !== null) {
        this.toast.success('Votre paiement a bien été effectué, vous pouvez dorénavant accéder aux sessions video', 'Paiement Effectué', {
          positionClass: 'toast-top-full-width',
          timeOut: 7000
        });
      }
    });
  }

  ngOnDestroy() {
    this.querySub.unsubscribe();
  }
}
