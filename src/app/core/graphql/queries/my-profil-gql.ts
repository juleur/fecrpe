import { Injectable } from '@angular/core';
import { Query } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
  providedIn: 'root',
})
export class MyProfilGQL extends Query<any> {
  document = gql`
    query myProfil($userId: Int!) {
      myProfil(userId: $userId) {
        id
        username
        email
      }
    }
  `;
}
