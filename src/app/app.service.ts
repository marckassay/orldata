import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DatasetIDs, environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
/**
 * Retrieves metadata for datasets.
 *
 * @ref https://socratametadataapi.docs.apiary.io/#introduction/endpoints
 */
export class CoreService {
  private PERMITS_ENDPOINT = environment.metadata_endpoint(DatasetIDs.PERMITS);
  private CRIMES_ENDPOINT = environment.metadata_endpoint(DatasetIDs.CRIMES);
  private APP_TOKEN = environment.token || '';

  constructor(private http: HttpClient) {

  }

  /**
   * Calls the following:
   * `https://data.cityoforlando.net/api/views/metadata/v1/ryhf-m453`
   */
  getPermitsMetadata(): Observable<object[]> {
    return this.http.get<object[]>(this.PERMITS_ENDPOINT, this.getHttpHeader())
      .pipe(
        catchError(error => throwError(error))
      );
  }

  /**
   * Calls the following:
   * `https://data.cityoforlando.net/api/views/metadata/v1/4y9m-jbmz`
   */
  getCrimesMetadata(): Observable<object[]> {
    return this.http.get<object[]>(this.CRIMES_ENDPOINT, this.getHttpHeader())
      .pipe(
        catchError(error => throwError(error))
      );
  }

  private getHttpHeader(): { headers: HttpHeaders } {
    return {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-type': 'application/json',
        'X-App-Token': this.APP_TOKEN,
      })
    };
  }
}
