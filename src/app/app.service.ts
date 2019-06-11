import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
/**
 * @ref https://dev.socrata.com/foundry/data.cityoforlando.net/ryhf-m453
 */
export class CoreService {
  private API_ENDPOINT = environment.endpoint;
  private APP_TOKEN = environment.token || '';

  constructor(private http: HttpClient) {

  }

  /**
   * CORS limitation is preventing to get Http header; 'Access-Control-Allow-Headers'. May need to
   * have this on cloud service.
   *
   * @ref https://dev.socrata.com/docs/cors-and-jsonp.html
   */
  getLastModifiedDate(): Observable<object[]> {
    const query =
      'select * ' +
      'where processed_date is not null ' +
      'order by processed_date DESC ' +
      'limit 1';

    return this.http.get<object[]>(this.getFullQueryExpression(query), this.getHttpHeader())
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
        /*  observe: 'response' */
      })
    };
  }

  private getFullQueryExpression(query: string): string {
    return this.API_ENDPOINT + '?$query=' + query;
  }
}
