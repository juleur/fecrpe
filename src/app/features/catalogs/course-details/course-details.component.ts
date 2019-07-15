import { Component, OnInit, ElementRef, ContentChild, AfterContentInit, ViewChild, AfterViewInit } from '@angular/core';
import { Observable } from 'apollo-link';
import { read } from 'fs';

declare var paypal: any;

@Component({
  selector: 'course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.scss']
})
export class CourseDetailsComponent implements OnInit, AfterViewInit {
  @ViewChild('paypal', {static: false}) paypalElement: ElementRef;
  courseBought$: Observable<boolean>;

  constructor() { }

  ngOnInit() {
    this.courseBought$ = Observable.of(false);
  }

  ngAfterViewInit() {
    paypal
      .Buttons({
        locale: 'fr_FR',
        style: {
          color: 'blue',
          shape: 'rect',
          label: 'pay',
          size: 'medium',
          layout: 'horizontal',
          tagline: 'true',
        },
        createOrder: (_, actions: any) => {
          return actions.order.create({
            purchase_units: [
              {
                description: 'Simple test',
                amounts: {
                  currency_code: 'EUR',
                  value: 12.03,
                }
              }
            ]
          });
        },
        onApprove: async (data: any, actions: any) => {
          const order = await actions.order.capture();
        },
        onError: (err: Error) => {
          console.log(err);
        }
      })
      .render(this.paypalElement.nativeElement);
  }
}
