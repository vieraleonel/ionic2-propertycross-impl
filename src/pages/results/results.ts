import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { PropertiesProvider } from '../../providers/properties-provider';
import { PropertyDetailsPage } from '../property-details/property-details';

@Component({
  selector: 'page-results',
  templateUrl: 'results.html'
})
export class ResultsPage {

  public queryData;
  public loadMore;

  constructor(public navCtrl: NavController,
    public propertiesProvider: PropertiesProvider) {
    this.queryData = {};
    this.loadMore = {};
  }

  /**
   * startup method. Get queried results and sets Load More state
   */
  ionViewWillEnter() {
    this.queryData = this.propertiesProvider.getLastQueryResults();
    this.loadMore = {
      loading: false,
      label: 'Load more ...',
      canLoad: this.queryData.page < this.queryData.pages
    };
  }

  /**
   * Toggle Load More state
   */
  private toggleLoadMore() {
    if (this.loadMore.loading) {
      this.loadMore.loading = false;
      this.loadMore.label = 'Load more ...';
    } else {
      this.loadMore.loading = true;
      this.loadMore.label = 'Loading ...';
    }

    this.loadMore.canLoad = this.queryData.page < this.queryData.pages;
  }

  /**
   * Navigates to Property details page with selected property
   *
   * @param  Object property
   */
  goToPropertyDetails(property) {
    this.navCtrl.push(PropertyDetailsPage, {selectedProperty: property});
  }

  /**
   * get more results from last query
   */
  getMoreProperties() {
    this.toggleLoadMore();

    this.propertiesProvider.loadMore()
      .then(data => {
          this.queryData = data;
          this.toggleLoadMore();
      }).
      catch((error) => {
         this.toggleLoadMore();
         alert(error.message);
      });
  }

}
