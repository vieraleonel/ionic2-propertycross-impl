import {Component} from "@angular/core";
import {Platform, ionicBootstrap} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {HomePage} from './pages/home/home';

import {Nestoria} from './providers/nestoria/nestoria';
import {RecentSearchesStorage} from './providers/recent-searches-storage/recent-searches-storage';

@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>',
  providers: [Nestoria]
})
export class MyApp {
  rootPage: any = HomePage;

  constructor(platform: Platform) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }
}

ionicBootstrap(MyApp);

