import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

import {PropertyDetailsPage} from '../property-details/property-details';
import {Nestoria} from '../../providers/nestoria/nestoria';

@Component({
  templateUrl: 'build/pages/results/results.html'
})
export class ResultsPage {
  
  public properties;
  public queryInfo;
  public loading = false;

  constructor(private nav: NavController,
              private navParams: NavParams,
              private nestoriaService: Nestoria) {
    
    this.properties = navParams.get('properties');

    this.queryInfo = {
      searchTerm: navParams.get('searchTerm'),
      page: navParams.get('page'),
      pages: navParams.get('pages'),
      showing: navParams.get('showing'),
      results: navParams.get('results')
    };
  }

  goToDetail(index) {
    this.nav.push(PropertyDetailsPage, {
      property: this.properties[index]
    });
  }

  loadMoreProperties() {

    if (this.queryInfo.page < this.queryInfo.pages) {

      this.loading = true;

      this.nestoriaService.getProperties(this.queryInfo.searchTerm, this.queryInfo.page + 1).subscribe(
        data => {
          let res = data.json();

          this.loading = false;

          if (res.response.application_response_code == 100 ||
              res.response.application_response_code == 101 ||
              res.response.application_response_code == 110) {

            // update query variables
            this.queryInfo.page++;
            this.queryInfo.showing += res.response.listings.length;

            this.properties = this.properties.concat(res.response.listings);
          } else {
            console.error('OTRO CODE ', res.response.application_response_code)
          }
        },
        err => {
          console.error(err);
          this.loading = false;
        }
      );
    }
  }

  canLoadMore() {
    return this.queryInfo.page < this.queryInfo.pages;
  }
}
