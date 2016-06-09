import {Component} from '@angular/core';
import {NavController, NavParams, Platform} from 'ionic-angular';

@Component({
  templateUrl: 'build/pages/property-details/property-details.html',
})
export class PropertyDetailsPage {
  public property;

  constructor(private nav: NavController,
              private navParams: NavParams,
              public platform: Platform) {

      this.property = navParams.get('property');
  }

  getFormattedTitle() {
    let split = this.property.title.split(',');

    if (split.length > 1) {
      return split[0] + ', ' + split[1];
    } else {
      return split[0];
    }
  }
}
