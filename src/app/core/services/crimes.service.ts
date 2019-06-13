import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DatasetIDs, environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
/**
 * Calls the API for Crimes only.
 *
 * @ref https://dev.socrata.com/foundry/data.cityoforlando.net/ryhf-m453
 */
export class CrimesService {
  private METADATA_ENDPOINT = environment.metadata_endpoint(DatasetIDs.CRIMES);
  // private API_ENDPOINT = environment.endpoint(DatasetIDs.CRIMES);
  private APP_TOKEN = environment.token || '';

  constructor(private http: HttpClient) {

  }

  /**
   * Calls the following:
   * `https://data.cityoforlando.net/api/views/metadata/v1/4y9m-jbmz`
   */
  getMetadata(): Observable<object[]> {
    return this.http.get<object[]>(this.METADATA_ENDPOINT, this.getHttpHeader())
      .pipe(
        catchError(error => throwError(error))
      );
  }

  private getHttpHeader(): { headers: HttpHeaders } {
    return {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-type': 'application/json',
        'X-App-Token': this.APP_TOKEN
      })
    };
  }
  /*
  private getFullQueryExpression(query: string): string {
    return this.API_ENDPOINT + '?$query=' + query;
  } */
}
