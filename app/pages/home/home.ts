import {Component, OnInit} from "@angular/core";
import {NavController, Loading} from 'ionic-angular';

import {Nestoria} from '../../providers/nestoria/nestoria';
import {RecentSearchesStorage} from '../../providers/recent-searches-storage/recent-searches-storage';

import {ResultsPage} from '../results/results'

@Component({
    templateUrl: 'build/pages/home/home.html',
    providers: [RecentSearchesStorage]
})
export class HomePage implements OnInit {
    public searchTerm;
    public recentSearches;

    private loading: Loading;

    constructor(private nestoriaService: Nestoria,
        private nav: NavController,
        private recentSearchesStorage: RecentSearchesStorage) {}

    ngOnInit() {
        this.recentSearchesStorage
            .init()
            .then(value => {
                this.recentSearches = value;
            });
    }

    private updateRecentSearches(term, results) {
        this.recentSearchesStorage.addSearch(term, results);
        this.recentSearches = this.recentSearchesStorage.getSearches();
    }

    private showLoading() {
        this.loading = Loading.create({ content: "Searching..." });
        this.nav.present(this.loading);
    }

    private hideLoading() {
        this.loading.dismiss();
    }

    getPropertiesByTerm() {

        this.showLoading();

        this.nestoriaService.getProperties(this.searchTerm).subscribe(
            data => {
                var res = data.json();

                this.hideLoading();

                if (res.response.application_response_code == 100 ||
                    res.response.application_response_code == 101 ||
                    res.response.application_response_code == 110) {

                    // add to recent
                    this.updateRecentSearches(this.searchTerm, res.response.total_results);

                    // go to results page
                    this.nav.push(ResultsPage, {
                        searchTerm: this.searchTerm,
                        page: 1,
                        pages: res.response.total_pages + 1,
                        showing: res.response.listings.length,
                        results: res.response.total_results,
                        properties: res.response.listings
                    });
                } else {
                    console.error('OTRO CODE ', res.response.application_response_code);
                }
            },
            err => {
                console.error(err);
                this.hideLoading()
            }
        );
    }
}
