import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

/*
  Generated class for the Nestoria provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Nestoria {

  constructor(public http: Http) {}

  getProperties(searchTerm, page = 1) {
    let repos = this.http.get(`/api?country=uk&pretty=1&action=search_listings&encoding=json&listing_type=buy&page=${page}&place_name=${searchTerm}`);
    return repos;
  }
}

