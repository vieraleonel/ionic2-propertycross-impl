import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { CONSTANTS } from './constants';
import { Geolocation } from 'ionic-native';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class PropertiesProvider {

  private lastQueryResults;
  private searchTerm;
  private searchCoordinates;

  constructor(public http: Http) {
    this.lastQueryResults = {};
    this.searchTerm = '';
    this.searchCoordinates = null;
  }

  /**
   * Compose url for term based searches
   *
   * @param  string term Term to search
   * @param  int page Page number
   * @return string URL
   */
  private composeTermUrl(term, page) {
    return CONSTANTS.PROPERTY_API.baseUrl + '&page=' + page + '&place_name=' + term;
  }

  /**
   * Compose url for location based searches
   *
   * @param  Object coordinates Geolocation object
   * @param  int page Page number
   * @return string URL
   */
  private composePositionUrl(coordinates, page) {
    return CONSTANTS.PROPERTY_API.baseUrl + '&page=' + page +
      '&centre_point=' + coordinates.lat + ',' + coordinates.lng;
  }

  /**
   * Perform a search of properties by term
   *
   * @param  string term
   * @return Promise
   */
  searchByTerm(term) {
    this.searchCoordinates = null;
    this.searchTerm        = term;

    return this.http.get(this.composeTermUrl(term, 1))
      .toPromise()
      .then(response => this.processResponse(response.json()))
      .catch(error => this.processFailedResponse(error.json(), CONSTANTS.PROPERTY_API.error.messages.GENERIC_ERROR));
  }

  /**
   * Perform search by Position
   *
   * @return Promise
   */
  searchByPosition() {
    this.searchCoordinates = null;
    this.searchTerm        = '';

    return Geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 5000 })
      .then(position => this.positionSuccess(position))
      .catch(error => this.positionError(error));
  }

  /**
   * Make a request to find ob
   * @param Object position Obtained device position
   */
  private positionSuccess(position) {
    this.searchCoordinates = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };

    return this.http.get(this.composePositionUrl(this.searchCoordinates, 1))
      .toPromise()
      .then(response => this.processResponse(response.json()))
      .catch(error => this.positionError(error));
  }

  /**
   * Handle error on Geolocation Error
   * @param object error Error object from geolocation
   */
  private positionError(error) {
    let msg = '';

    if (error.code === error.PERMISSION_DENIED) {
      msg = CONSTANTS.PROPERTY_API.error.messages.LOCATION_DISABLED;
    } else if (error.code === error.POSITION_UNAVAILABLE) {
      msg = CONSTANTS.PROPERTY_API.error.messages.LOCATION_UNAVAILABLE;
    }
    else {
      msg = CONSTANTS.PROPERTY_API.error.messages.GENERIC_ERROR
    }

    return this.processFailedResponse(error, msg);
  }

  /**
   * Process successfull response from API
   *
   * @param  Object data API response
   * @return Object Procesed results
   */
  private processResponse(data) {
    switch (data.response.application_response_code) {

      // OK codes
      case '100':
      case '101':
      case '110':
        // Some properties found
        if (data.response.listings.length) {
          this.lastQueryResults = {
            status: CONSTANTS.PROPERTY_API.status.SUCCESS,
            message: '',
            searchTerm: this.searchTerm,
            searchCoordinates: this.searchCoordinates,
            page: data.response.page,
            pages: data.response.total_pages + 1,
            showing: data.response.listings.length,
            results: data.response.total_results,
            properties: data.response.listings
          };
        }
        // No properties found
        else {
          this.lastQueryResults = {
            status: CONSTANTS.PROPERTY_API.status.ERROR,
            message: 'There were no properties found for the given location.',
            searchTerm: this.searchTerm,
            searchCoordinates: this.searchCoordinates
          };
        }
        break;

      // Ambiguous codes
      case '200':
      case '202':
        this.lastQueryResults = {
          status: CONSTANTS.PROPERTY_API.status.AMBIGUOUS,
          message: '',
          searchCoordinates: this.searchCoordinates,
          searchTerm: this.searchTerm,
          locations: data.response.locations
        };
        break;

      // everything else is considered as error
      default:
        this.lastQueryResults = this.processFailedResponse(null, CONSTANTS.PROPERTY_API.error.messages.GENERIC_ERROR);
    } // switch

    return this.lastQueryResults;
  }

  /**
   * Process erroneous responses from API
   *
   * @param  string error Browser description of error
   * @param  string msg Message shown to user
   * @return Object
   */
  private processFailedResponse(error, msg) {
    console.error(error);

    this.lastQueryResults = {
      status: CONSTANTS.PROPERTY_API.status.ERROR, // error
      message: msg,
      searchCoordinates: this.searchCoordinates,
      searchTerm: this.searchTerm
    };

    return this.lastQueryResults;
  }

  /**
   * Use last query parameter to get more results by asking for next page.
   *
   * @return Promise
   */
  loadMore() {

    // Term based search
    if (this.lastQueryResults.searchCoordinates === null) {
      return this.http.get(this.composeTermUrl(this.lastQueryResults.searchTerm, this.lastQueryResults.page +1))
        .toPromise()
        .then(response => this.loadMoreComplete(response.json()))
        .catch(error => this.processFailedResponse(error, CONSTANTS.PROPERTY_API.error.messages.GENERIC_ERROR));
    }
    // Location based search
    else {
      return this.http.get(this.composePositionUrl(this.lastQueryResults.searchCoordinates, this.lastQueryResults.page +1))
        .toPromise()
        .then(response => this.loadMoreComplete(response.json()))
        .catch(error => this.processFailedResponse(error, CONSTANTS.PROPERTY_API.error.messages.GENERIC_ERROR));
    }
  }

  private loadMoreComplete(data) {
    this.lastQueryResults.page++;
    this.lastQueryResults.properties = this.lastQueryResults.properties.concat(data.response.listings);
    this.lastQueryResults.showing    = this.lastQueryResults.properties.length;

    return this.lastQueryResults;
  }

  /**
   * Return last results obtained
   *
   * @return Object
   */
  getLastQueryResults() {
    return this.lastQueryResults;
  }
} // PropertiesProvider
