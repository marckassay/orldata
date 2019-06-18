import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DatasetIDs, environment } from 'src/environments/environment';
import { QueryBuilder } from './query-builder';

export const QUERY_LIMIT = 40;

@Injectable({
  providedIn: 'root',
})
/**
 * Calls the API for Permits only.
 *
 * @ref https://dev.socrata.com/foundry/data.cityoforlando.net/ryhf-m453
 */
export class PermitsService {
  private METADATA_ENDPOINT = environment.metadata_endpoint(DatasetIDs.PERMITS);
  private API_ENDPOINT = environment.endpoint(DatasetIDs.PERMITS);
  private APP_TOKEN = environment.token || '';

  constructor(private http: HttpClient,
              private qb: QueryBuilder) {

  }

  /**
   * Calls the following:
   * `https://data.cityoforlando.net/api/views/metadata/v1/ryhf-m453`
   */
  getMetadata(): Observable<object[]> {
    return this.http.get<object[]>(this.METADATA_ENDPOINT, this.getHttpHeader())
      .pipe(
        catchError(error => throwError(error))
      );
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
  search(action: { selectedApplicationTypes: { application_type: string[] } },
         offset: number,
         limit = QUERY_LIMIT): Observable<{ results: object[], offset: number, count: number }> {
    let query = 'select * ' +
    this.qb.where(action.selectedApplicationTypes) + ' AND ' +
    `starts_with(permit_number, 'BLD____-') `;

    if (offset > 0) {
      query += 'order by permit_number DESC ' +
        'limit ' + limit +
        'offset ' + offset;
    } else {
      query += '|> SELECT COUNT(*)';
    }

    return this.http.get<object[]>(this.getFullQueryExpression(query), this.getHttpHeader())
      .pipe(
        map((value) => {
          const countValue = (offset > -1) ? -1 : parseInt((value[0] as any).COUNT, 10);
          return { results: (countValue === -1) ? value : [], offset, count: countValue };
        }),
        catchError(error => throwError(error))
      );
  }

  getDistinctApplicationTypes(): Observable<Array<{ application_type: string }>> {
    const query = 'select distinct application_type';

    return this.http.get<{ application_type: string }[]>(this.getFullQueryExpression(query), this.getHttpHeader())
      .pipe(
        map(types => types),
        catchError(error => throwError(error))
      );
  }

  getDistinctWorkTypes(): Observable<object[]> {
    const query = 'select distinct worktype';

    return this.http.get<object[]>(this.getFullQueryExpression(query), this.getHttpHeader())
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
    return this.API_ENDPOINT + '?$query=' + query;
  }
}
