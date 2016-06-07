import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

/*
  Generated class for the ResultsPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/results/results.html',
})
export class ResultsPage {
  public showing;
  public results;
  public properties;

  constructor(private nav: NavController,
              private navParams: NavParams) {

    this.showing = navParams.get('showing');
    this.results = navParams.get('results');
    this.properties = navParams.get('properties');
  }
}
