import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { RefresherCourse } from './../../../core/models/refresher-course.model';
import { AuthService } from './../../../core/services/auth.service';
import { PURCHASEREFCOURSE_GQL, PurchaseRefCourseResponse } from './course-details-gql';
import { Apollo } from 'apollo-angular';
import { ToastrService } from 'ngx-toastr';
import { Session, User } from 'src/app/core';

declare var paypal;

@Component({
  selector: 'course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.scss'],
})
export class CourseDetailsComponent implements OnInit {
  @ViewChild('paypalButton') set paypalButton(element: ElementRef) {
    if (element) {
      paypal
        .Buttons({
          style: { color: 'blue', shape: 'rect', label: 'pay', size: 'medium', layout: 'horizontal', tagline: 'true' },
          createOrder: (_, actions: any) => {
            return actions.order.create({
              purchase_units: [
                {
                  description: '',
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
  isUserLoggedIn$: Observable<boolean>;
  refresherCourse: RefresherCourse;
  teachers: string;
  sessions: Session[];
  showError = false;

  constructor(private auth: AuthService, private apollo: Apollo, private toast: ToastrService, private activatedRoute: ActivatedRoute) {
    this.isUserLoggedIn$ = this.auth.isLoggedIn$;
    this.activatedRoute.data.subscribe(res => {
      if (res.course.data) {
        this.refresherCourse = res.course.data.refresherCourse.refresherCourse;
        this.sessions = res.course.data.refresherCourse.sessions;
        this.refresherCourse.teachers.map(t => {
          let arr: string[] = [];
          arr.push(t.username);
          this.teachers = arr.join(' et ');
        });
      }
      if (res.course.errors) {
        this.showError = true;
        for (const err of res.course.errors) {
          switch (err.extensions.statusText) {
            case 'Not Found':
              this.toast.warning(`${err.message}`, 'Cours', {
                positionClass: 'toast-top-full-width',
                timeOut: 3000
              });
              break;
            case 'Internal Server Error':
              this.toast.error(`${err.message}`, 'Cours', {
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
    }).subscribe(({data, errors}) => {
      if (data) {
        this.toast.success('Votre paiement a bien été effectué, vous pouvez dorénavant accéder aux sessions video', 'Paiement Effectué', {
          positionClass: 'toast-top-full-width',
          timeOut: 6000
        });
      }
      if (errors) {
        for (const err of errors) {
          this.toast.error(`${err.message}`, 'Paiement Refusé', {
            positionClass: 'toast-top-full-width',
            timeOut: 5000
          });
        }
      }
    });
  }
}
