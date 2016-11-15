import { Component } from '@angular/core';
import { NavParams, Platform } from 'ionic-angular';
import { FavouritesProvider } from '../../providers/favourites-provider';

@Component({
  selector: 'page-property-details',
  templateUrl: 'property-details.html'
})
export class PropertyDetailsPage {

  public property;

  constructor(public navParams: NavParams,
    public platform: Platform,
    public favouritesProvider: FavouritesProvider) {
    this.property = {};
  }

  ionViewWillEnter() {
    this.prepareProperty(this.navParams.get('selectedProperty'));
  }

  /**
   * Transforms property title and check for favourite state
   *
   * @param  Object property
   * @return Object Prepared property
   */
  private prepareProperty(property) {
    this.property = property;
    this.property.title = this.formatTitle(this.property.title);

    this.favouritesProvider.isFav(this.property)
      .then(isFav => {this.property.isFav = isFav});

    return property;
  }

  /**
   * Take only first and second title parts
   *
   * @param  string title
   * @return string Formatted title
   */
  private formatTitle(title) {
    let splitTitle = title.split(',');

    if (splitTitle.length > 1) {
      title = splitTitle[0] + ', ' + splitTitle[1];
    } else {
      title = splitTitle[0];
    }

    return title;
  }

  /**
   * Toggles fav state
   */
  toggleFav() {
    if (this.property.isFav) {
      this.favouritesProvider.remove(this.property);
    } else {
      this.favouritesProvider.store(this.property);
    }

    this.property.isFav = !this.property.isFav;
  }

}
