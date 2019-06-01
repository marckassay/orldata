import { Component, Input } from '@angular/core';

@Component({
  selector: 'orl-dataset-item',
  template: `
    <mat-icon mat-list-icon>find_in_page</mat-icon>
    <h4 mat-line>{{item.name}}</h4>
    <p mat-line> {{item.updated | date}} </p>
  `,
  styles: [ `
    .mat-list-icon {
      // color: rgba(0, 0, 0, 0.54);
    }
  `,
  ]
})
export class DatasetItemComponent {
  @Input() item: any;
}
