import { Injectable } from '@angular/core';
import localforage from 'localforage';
import {findIndex, isEmpty, pull} from 'lodash';

@Injectable()
export class FavouritesProvider {

  // local copy of favourites
  private favourites;

  constructor() {
    this.favourites = null;
  }

  /**
   * retrieve stored favourites and cache them in service local variable
   *
   * @return Promise
   */
  private init() {
    return localforage.getItem('favouriteProperties')
      .then(favs => {
        this.favourites = favs;
        return this.favourites;
      })
      .catch(error => {console.error(error)});
  }

  /**
   * Get favourites from local variable or storage
   *
   * @return Promise
   */
  get() {
    if (this.favourites !== null) {
      return Promise.resolve(this.favourites);
    } else {
      return this.init();
    }
  }

  /**
   * Generates key from property
   *
   * @param Object property
   * @return String Generated key
   */
  private getPropertyKey(property) {
    return btoa(property.lister_url);
  }

  /**
   * Check if a property is favourite
   *
   * @param Object property
   * @return Promise
   */
  isFav(property) {
    return this.get()
      .then(favs => findIndex(favs, ['key', this.getPropertyKey(property)]) > -1)
      .catch(error => {
        console.error(error);
        return false;
      });
  }

  /**
   * Stores a property in favourites list
   *
   * @param  Object property
   */
  store(property) {

    property.key = this.getPropertyKey(property);

    if (this.favourites === null || isEmpty(this.favourites)) {
      this.favourites = [property];
    }
    else {
      // try to find term
      let index = findIndex(this.favourites, ['key', property.key]);

      // update date or insert
      if (index > -1) {
        this.favourites[index] = property;
      }
      else {
        this.favourites.push(property);
      }
    }

    // update storage
    localforage.setItem('favouriteProperties', this.favourites);
  }

  /**
   * Remove a property from favourites storage
   *
   * @param  Object property
   */
  remove(property) {

    // try to find property
    var index = findIndex(this.favourites, ['key', this.getPropertyKey(property)]);

    // delete element from favourites
    if (index > -1) {
        pull(this.favourites, this.favourites[index]);
    }

    // update storage
    localforage.setItem('favouriteProperties', this.favourites);
  }
}
