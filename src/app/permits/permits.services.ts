import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
/**
 * @ref https://dev.socrata.com/foundry/data.cityoforlando.net/ryhf-m453
 */
export class PermitsService {
  private API_ENDPOINT = environment.endpoint;
  private APP_TOKEN = environment.token || '';

  constructor(private http: HttpClient) {

  }

  getRecentPermits(filter: string, offset: number, limit: number = 30): Observable<object[]> {
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

  private getHttpHeader(fullResponse = false): { headers: HttpHeaders } {
    if (fullResponse === false) {
      return {
        headers: new HttpHeaders({
          Accept: 'application/json',
          'Content-type': 'application/json',
          'X-App-Token': this.APP_TOKEN
        })
      };
    } else {
      return {
        headers: new HttpHeaders({
          Accept: 'application/json',
          'Content-type': 'application/json',
          'X-App-Token': this.APP_TOKEN,
          observe: 'response'
        })
      };
    }
  }

  private getFullQueryExpression(query: string): string {
    return this.API_ENDPOINT + '?$query=' + query;
  }
}
