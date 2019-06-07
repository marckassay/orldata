import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PermitService {
  private API_ENDPOINT = environment.endpoint;
  private APP_TOKEN = environment.token || '';
  private httpOptions: {headers: HttpHeaders};

  constructor(private http: HttpClient) {
    this.httpOptions = {
      headers: new HttpHeaders({
         Accept: 'application/json',
        'Content-type': 'application/json',
        'X-App-Token': this.APP_TOKEN
      })
    };
   }

  getRecentPermits(filter: string, offset: number, limit: number = 30): Observable<object[]> {
    const query =
    'select processed_date, application_type ' +
    // 'where application_type is ' + filter +
    'where processed_date is not null ' +
    'order by processed_date DESC ' +
    'limit ' + limit; // + ' offset ' + offset;

    return this.http.get<object[]>(this.getFullQueryExpression(query), this.httpOptions)
      .pipe(
        catchError(error => throwError(error))
      );
  }

  getDistinctApplicationTypes(): Observable<string[]> {
    const query = 'select distinct application_type';

    return this.http.get<string[]>(this.getFullQueryExpression(query), this.httpOptions)
      .pipe(
        map(types => types),
        catchError(error => throwError(error))
        );
  }

  private getFullQueryExpression(query: string): string {
    return this.API_ENDPOINT + '?$query=' + query;
  }
}
