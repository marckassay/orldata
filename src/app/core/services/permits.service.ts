import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DatasetIDs, environment } from 'src/environments/environment';
import { QueryBuilder } from './query-builder';

export const QUERY_LIMIT = 40;

export interface SearchRequest {
  selected: { selectedApplicationTypes: Array<{application_type: string}> };
  pagination?: {
    pageIndex: number;
    offset: number;
    limit: number;
  };
}

export interface SearchResponse {
  entities: object[] | undefined;
  pagination: {
    pageIndex: number;
    count: number;
  };
  lastResponseTime: number;
}

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
   * items are in this search. Second call gets the first batch, thats if `pageIndex` is 0.
   *
   * @param filter OData expression
   * @param pageIndex index value indicating page number. works with limit
   * @param offset maximum limit for items to fetch
   */
  search(request: SearchRequest): Observable<SearchResponse> {
    let query = 'select * ' + this.qb.where(request.selected.selectedApplicationTypes);

    if (request.pagination) {
      if (query.includes(' where (') === false) {
        query += ' AND ';
      }

      query += 'order by processed_date DESC limit ' + request.pagination.limit + ' offset ' + request.pagination.offset;
    } else {
      query += '|> SELECT COUNT(*)';
    }

    return this.http.get<object[]>(this.getFullQueryExpression(query), this.getHttpHeader())
      .pipe(
        // simulates network latency
        // delayWhen(() => (request.pagination && request.pagination.pageIndex === 34) ? timer(5000) : timer(500)),
        map((value) => {
          const countValue = (request.pagination === undefined) ? parseInt((value[0] as any).COUNT, 10) : -1;
          return {
            entities: (countValue === -1) ? value : undefined,
            pagination: { pageIndex: (request.pagination !== undefined) ? request.pagination.pageIndex : -1, count: countValue},
            lastResponseTime: Date.now()
          };
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
