import {Injectable} from '@angular/core';
import * as localforage from 'localforage';
import * as _ from 'lodash';

@Injectable()
export class RecentSearchesStorage {

    private searches;

    constructor() {
        localforage.getItem('recentSearches')
            .then(value => this.searches = value);
    }

    init() {
        return localforage.getItem('recentSearches');   
    }

    getSearches() {
        return this.searches;
    }

    addSearch(term, results) {
        let search = {
            term: term,
            results: results,
            date: new Date().toISOString()
        }

        if (this.searches === null) {

            this.searches = [search];
            localforage.setItem('recentSearches', [search])
        }
        else {
            // try to find term
            let index = _.findIndex(this.searches, ['term', search.term]);

            // update date or insert
            if (index > -1) {
                this.searches[index] = search;
            }
            else {
                this.searches.push(search);
            }

            // order
            this.searches = _.reverse(_.sortBy(this.searches, ['date']));

            // only 6 elements
            this.searches = _.slice(this.searches, 0, 6);

            // persit only 6 elements
            localforage.setItem('recentSearches', this.searches);
        }
    }
}

