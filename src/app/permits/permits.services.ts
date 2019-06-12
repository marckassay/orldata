import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DatasetIDs, environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
/**
 * Calls the API for Permits only.
 *
 * @ref https://dev.socrata.com/foundry/data.cityoforlando.net/ryhf-m453
 */
export class PermitsService {
  private PERMITS_ENDPOINT = environment.endpoint(DatasetIDs.PERMITS);
  private APP_TOKEN = environment.token || '';

  constructor(private http: HttpClient) {

  }

  /**
   * This service does 2 calls that return: number of results and the results themselves
   *
   * The first call is a value to be passed into Mat-Paginator. With this value we know how many
   * items are in this search. Second call gets the first batch, thats if `offset` is 0.
   *
   * @param filter OData expression
   * @param offset index value indicating page number. works with limit
   * @param limit maximum limit for items to fetch
   */
  getRecentPermits(filter: string, offset: number, limit = 30): Observable<object[]> {
    const query =
      'select processed_date, application_type ' +
      'where application_type = ' + `'${filter}'` + ' AND ' +
      'processed_date is not null ' +
      'order by processed_date DESC ' +
      'limit ' + limit + ' offset ' + offset;

    return this.http.get<object[]>(this.getFullQueryExpression(query), this.getHttpHeader())
      .pipe(
        catchError(error => throwError(error))
      );
  }

  getDistinctApplicationTypes(): Observable<string[]> {
    const query = 'select distinct application_type';

    return this.http.get<string[]>(this.getFullQueryExpression(query), this.getHttpHeader())
      .pipe(
        map(types => types),
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

  private getFullQueryExpression(query: string): string {
    return this.PERMITS_ENDPOINT + '?$query=' + query;
  }
}
