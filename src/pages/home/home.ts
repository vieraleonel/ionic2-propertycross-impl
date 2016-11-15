import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { PropertiesProvider } from '../../providers/properties-provider';
import { RecentSearchesProvider } from '../../providers/recent-searches-provider';
import { CONSTANTS } from '../../providers/constants';
import { ResultsPage } from '../results/results';
import { FavouritesPage } from '../favourites/favourites';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public searchTerm;
  public recentSearches;
  public state;
  public errorMessage;
  public locations;
  private loader;

  constructor(public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public propertiesProvider: PropertiesProvider,
    public recentSearchesProvider: RecentSearchesProvider) {

    this.searchTerm     = '';
    this.recentSearches = [];
    this.state          = 1;
    this.errorMessage   = '';
    this.locations      = [];
    this.loader         = null;
  }

  /**
   * Executes every time view is going active
   */
  ionViewWillEnter() {
    this.recentSearchesProvider.get()
      .then(data => {this.recentSearches = data});
  }

  /**
   * Toggle Loading modal visibility
   */
  private toggleModal() {
    if (this.loader === null) {
      this.loader = this.loadingCtrl.create({
        content: 'Loading...'
      });
      this.loader.present();
    }
    else {
      this.loader.dismiss();
      this.loader = null;
    }
  }

  /**
   * Performs a search by term
   */
  searchByTerm() {
    this.toggleModal();

    // do search
    this.propertiesProvider.searchByTerm(this.searchTerm)
      .then(data => this.processResponse(data))
      .catch(error => { this.showErrorState({message: 'Other error'}); });
  }

  /**
   * Process Successfull data response from service
   *
   * @param  Object data Returned service response
   */
  private processResponse(data) {
    if (data.status === CONSTANTS.PROPERTY_API.status.SUCCESS) {
      this.showResultsPage(data);
    }
    else if (data.status === CONSTANTS.PROPERTY_API.status.AMBIGUOUS) {
      this.showLocationsState(data);
    }
    else { // error
      this.showErrorState(data);
    }
  }

  /**
   * Performs a search by current position
   */
  searchByPosition() {
    this.searchTerm = '';

    this.toggleModal();

    this.propertiesProvider.searchByPosition()
       .then(data => { this.processResponse(data); })
       .catch(error => { this.showErrorState(error); });
  }

  /**
   * Navigates to results page
   *
   * @param  Object data
   */
  private showResultsPage(data) {
    this.state        = 1;
    this.locations    = [];
    this.errorMessage = '';

    // if search was by term, stores it in recent searches
    if (this.searchTerm !== '') {
      this.recentSearchesProvider.store({
        term: this.searchTerm,
        results: data.results
      });
    }

    this.toggleModal();

    this.navCtrl.push(ResultsPage);
  }

  /**
   * Shows user a list to select a location
   *
   * @param  Object data
   */
  private showLocationsState(data) {
    this.state     = 2; // ambiguous
    this.locations = data.locations;

    this.toggleModal();
  }

  /**
   * Shows user a message for an error situation
   *
   * @param  Object data
   */
  private showErrorState(data) {
    this.state        = 0; // error
    this.errorMessage = data.message;

    this.toggleModal();
  }

  /**
   * Perform a term based search with de selected location (from location state)
   *
   * @param  Object location
   */
  doSearchWith(term) {
    this.state        = 1;
    this.locations    = [];
    this.errorMessage = '';
    this.searchTerm   = term;

    this.searchByTerm();
  }

  /**
   * Navigates to favourites pages
   */
  goToFaves() {
      this.navCtrl.push(FavouritesPage);
  }
}
