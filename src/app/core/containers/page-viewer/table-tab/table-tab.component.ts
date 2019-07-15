import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Observable } from 'rxjs';

@Component({
  selector: 'orl-table-tab',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="orl-table-container">
      <ng-container *ngTemplateOutlet="template"></ng-container>
    </div>

    <mat-paginator
      [pageIndex]="pageIndex | async"
      [pageSize]="limit | async"
      [length]="count | async"
      (page)="pageIndexChange($event)"></mat-paginator>
  `
})
export class TableTabComponent {

  @ViewChild(MatPaginator, { static: false })
  paginator: MatPaginator;

  @Input()
  template: TemplateRef<any>;

  @Input()
  count: Observable<number>;

  @Input()
  pageIndex: Observable<number>;

  @Input()
  limit: Observable<number>;

  @Output()
  paginate: EventEmitter<PageEvent>;

  constructor() {
    this.paginate = new EventEmitter<PageEvent>();
  }

  pageIndexChange(event: PageEvent) {
    this.paginate.emit(event);
  }
}
