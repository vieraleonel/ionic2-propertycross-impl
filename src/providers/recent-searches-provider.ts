import { Injectable } from '@angular/core';
import findIndex from 'lodash/findIndex';
import reverse from 'lodash/reverse';
import slice from 'lodash/slice';
import sortBy from 'lodash/sortBy';
import localforage from 'localforage';

@Injectable()
export class RecentSearchesProvider {

  private searches;

  constructor() {
    this.searches = null;
  }

  /**
   * retrieve stored recent searches and cache them in service local variable
   *
   * @return Promise
   */
  private init() {
    return localforage.getItem('recentSearches')
      .then(data => this.initComplete(data))
      .catch(error => this.initFailed(error));
  }

  private initComplete(data) {
    this.searches = data;
    return this.searches;
  }

  private initFailed(error) {
    console.error(error);
  }

  /**
   * Get recent searches
   *
   * @return Promise
   */
  get() {
      if (this.searches !== null) {
          return Promise.resolve(this.searches);
      } else {
          return this.init();
      }
  }

  /**
   * Store recent search
   *
   * @param  Object searchInfo Search to be stored
   */
  store(searchInfo) {
    let search = {
      term: searchInfo.term,
      results: searchInfo.results,
      date: new Date().toISOString()
    }

    // no searches stored
    if (this.searches === null) {
      this.searches = [search];
    }
    else {
      // try to find term
      let index = findIndex(this.searches, ['term', search.term]);

      // update date or insert
      if (index > -1) {
          this.searches[index] = search;
      }
      else {
          this.searches.push(search);
      }

      // order
      this.searches = reverse(sortBy(this.searches, ['date']));

      // only 6 elements
      this.searches = slice(this.searches, 0, 6);
    }

    // persist storage
    localforage.setItem('recentSearches', this.searches);
  }
}
