import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { merge } from 'rxjs/observable/merge';
import { of as observableOf } from 'rxjs/observable/of';
import { catchError } from 'rxjs/operators/catchError';
import { map } from 'rxjs/operators/map';
import { startWith } from 'rxjs/operators/startWith';
import { switchMap } from 'rxjs/operators/switchMap';

/**
 * @title Table retrieving data through HTTP
 */
@Component({
  selector: 'table-http-example',
  styleUrls: ['table-http-example.css'],
  templateUrl: 'table-http-example.html',
})
export class TableHttpExample implements AfterViewInit {
  displayedColumns = ['processed_date', 'application_type', 'permit_number'];
  exampleDatabase: ExampleHttpDao | null;
  dataSource = new MatTableDataSource();

  resultsLength = 0;
  isLoadingResults = false;
  isRateLimitReached = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private http: HttpClient) {

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.exampleDatabase = new ExampleHttpDao(this.http);

    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.exampleDatabase!.getRepoIssues(
            this.sort.active, this.sort.direction, this.paginator.pageIndex);
        }),
        map(data => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
         // this.resultsLength = data.total_count;

          return data;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          // Catch if the GitHub API has reached its rate limit. Return empty data.
          this.isRateLimitReached = true;
          return observableOf([]);
        })
      ).subscribe(data => this.dataSource.data = data);
  }
}


/** An example database that the data source uses to retrieve data for the table. */
export class ExampleHttpDao {
   httpOptions = {
      headers: new HttpHeaders({
         Accept: 'application/json',
        'Content-type': 'application/json',
        'X-App-Token': 'XsVdIPvgqvEmIgHOmFowjVeOu'
      })
    };

  constructor(private http: HttpClient) {}

  getRepoIssues(sort: string, order: string, page: number): Observable<object[]> {
    const href = 'https://data.cityoforlando.net/resource/ryhf-m453.json';
    const ee = `?\$query=select processed_date, application_type, permit_number where application_type = 'Electrical' AND processed_date is not null order by processed_date DESC limit 30 offset ${page + 1}`;
    const requestUrl = href + ee;

    return this.http.get<object[]>(requestUrl, this.httpOptions);
  }
}


/**  Copyright 2018 Google Inc. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */
