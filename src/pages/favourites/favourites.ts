import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FavouritesProvider } from '../../providers/favourites-provider';
import { PropertyDetailsPage } from '../property-details/property-details';

@Component({
  selector: 'page-favourites',
  templateUrl: 'favourites.html'
})
export class FavouritesPage {

  public faves;

  constructor(public navCtrl: NavController,
    public favouritesProvider: FavouritesProvider) {
    this.faves = [];
  }

  ionViewWillEnter() {
    this.favouritesProvider.get()
      .then(data => {this.faves = data});
  }

  /**
   * Navigates to property details page with selected favourite
   *
   * @param  Object property Selected property
   */
  goToPropertyDetails(property) {
    this.navCtrl.push(PropertyDetailsPage, {selectedProperty: property});
  }
}
