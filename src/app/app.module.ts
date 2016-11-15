import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ResultsPage } from '../pages/results/results';
import { FavouritesPage } from '../pages/favourites/favourites';
import { PropertyDetailsPage } from '../pages/property-details/property-details';
import { PropertiesProvider } from '../providers/properties-provider';
import { RecentSearchesProvider } from '../providers/recent-searches-provider';
import { FavouritesProvider } from '../providers/favourites-provider';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ResultsPage,
    FavouritesPage,
    PropertyDetailsPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ResultsPage,
    FavouritesPage,
    PropertyDetailsPage
  ],
  providers: [PropertiesProvider, RecentSearchesProvider, FavouritesProvider]
})
export class AppModule {}
