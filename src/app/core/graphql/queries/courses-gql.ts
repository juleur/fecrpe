import { Injectable } from '@angular/core';
import { Query } from 'apollo-angular';
import gql from 'graphql-tag';

// add parameters later
@Injectable({
  providedIn: 'root',
})
export class CoursesGQL extends Query<any> {
  document = gql`
    query courses {
      courses {
      }
    }
  `;
}
