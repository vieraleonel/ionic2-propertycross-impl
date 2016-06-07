import {Component} from "@angular/core";
import {NavController} from 'ionic-angular';

import {Nestoria} from '../../providers/nestoria/nestoria';

import {ResultsPage} from '../results/results'

@Component({
  templateUrl: 'build/pages/home/home.html',
  providers: [Nestoria]
})
export class HomePage {
  public searchTerm;

  constructor(private nestoriaService: Nestoria,
              private nav: NavController) {}

  getPropertiesByTerm() {
    this.nestoriaService.getProperties(this.searchTerm).subscribe(
      data => {
        var res = data.json();
        
        this.nav.push(ResultsPage, {
          showing: res.response.listings.length,
          results: res.response.total_results,
          properties: res.response.listings
        });
      },
      err => console.error(err)
    );
  }
}
