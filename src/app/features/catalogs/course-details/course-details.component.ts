import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, QueryList } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { RefresherCourse, Type as TypeCourse, AuthService } from 'src/app/core';
import { CourseDetailsGQL } from './../../../core/graphql/queries/course-details-gql';

declare var paypal;

@Component({
  selector: 'course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.scss'],
})
export class CourseDetailsComponent implements OnInit, AfterViewInit {
  @ViewChild('paypalRef', {static: false}) paypalElemRef: ElementRef<HTMLElement>;
  errMessage = '';

  refresherCourse$: Observable<RefresherCourse>;

  constructor(
    private courseDetailsGQL: CourseDetailsGQL,
    private auth: AuthService
  ) { }

  ngOnInit() {
    // this.refresherCourse$ = this.courseDetailsGQL.watch().valueChanges.pipe(
    //   map(res => res.data.refresherCourse)
    // );
    this.refresherCourse$ = of({
      id: 12, year: '2034', isFinished: false, price: 24,
      subject: {
        id: 12,
        name: 'Mathematique'
      },
      sessions: [
        {id: 12, type: TypeCourse.Lesson, title: 'Suite numérique'},
        {id: 45, type: TypeCourse.Lesson, title: 'Theoreme de Pythagore'},
        {id: 34, type: TypeCourse.Exercise, title: 'Lislo'}
      ]
    });
  }

  ngAfterViewInit() {
    paypal
      .Buttons({
        locale: 'fr_FR',
        style: {color: 'blue', shape: 'rect', label: 'pay', size: 'medium', layout: 'horizontal', tagline: 'true'},
        // createOrder: (_, actions: any) => {
        //   return actions.order.create({
        //     purchase_units: [
        //       {
        //         description: 'Simple test',
        //         amounts: {
        //           currency_code: 'EUR',
        //           value: 12.03,
        //         }
        //       }
        //     ]
        //   });
        // },
        // onApprove: async (data: any, actions: any) => {
        //   const order = await actions.order.capture();
        // },
        // onError: (err: Error) => {
        //   console.log(err);
        // }
      })
      .render(this.paypalElemRef.nativeElement);
    }
}
