import { Component, EventEmitter, Output } from '@angular/core';

export interface Datasets {
  name: string;
  updated: Date;
}

@Component({
  selector: 'orl-body',
  template: `
  <header>
    <h2>Welcome to City of Orlando's Open Data</h2>
    <h3>an unoffical syndication app</h3>
  </header>
  <mat-divider></mat-divider>
  <div>
    <mat-list>
      <h3 mat-subheader>Datasets</h3>
      <mat-list-item *ngFor="let item of items">
        <mat-icon mat-list-icon>find_in_page</mat-icon>
        <h4 mat-line>{{item.name}}</h4>
        <p mat-line> {{item.updated | date}} </p>
      </mat-list-item>
    </mat-list>
  </div>
`,
  styles: [`
  div {
    display: flex;
    justify-content: center;
    margin: 72px 0;
  }
  mat-list,
  mat-card {
    max-width: 400px;
    margin-left: 10px;
    margin-right: 10px;
  }
  mat-card-title,
  mat-card-content {
    display: flex;
    justify-content: center;
  }
  mat-card > img {
   filter: grayscale(100%);
   background-color: antiquewhite;
  }
  .mat-list-icon {
    // color: rgba(0, 0, 0, 0.54);
  }
  `]
})
export class HomeComponent {
  @Output() openMenu = new EventEmitter();

  items: Datasets[] = [
    {
      name: 'Permits',
      updated: new Date(),
    }
  ];
}
