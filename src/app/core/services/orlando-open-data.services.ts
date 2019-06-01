import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrlandoOpenDataService {
  private API_ENDPOINT = environment.endpoint;
  private APP_TOKEN = environment.token || '';
  private httpOptions: {headers: HttpHeaders};

  constructor(private http: HttpClient) {
    this.httpOptions = {
      headers: new HttpHeaders({
         Accept: 'application/json',
        'X-App-Token': this.APP_TOKEN
      })
    };
   }

  getDistinctApplicationTypes(): Observable<string[]> {
    const query = 'select distinct application_type';

    return this.http.get<string[]>(this.getFullQueryExpression(query), this.httpOptions)
      .pipe(
        map(types => types),
        catchError(error => throwError(error))
        );
  }

  private getFullQueryExpression(query): string {
    return this.API_ENDPOINT + '?$query = ' + query;
  }
}
