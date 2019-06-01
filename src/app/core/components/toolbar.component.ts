import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'orl-toolbar',
  template: `
  <mat-toolbar color="primary">
    <mat-toolbar-row>
    <a mat-button class="docs-button" routerLink="/" aria-label="City of Orlando Open Data">
      <mat-icon class="docs-orlando-logo" svgIcon="orlando_open_data_fountain"></mat-icon>
      <span>Orlando Open Data</span>
    </a>
    <span class="spacer"></span>
    <button mat-icon-button (click)="openMenu.emit()">
      <mat-icon>more_vert</mat-icon>
    </button>
    <orl-menu></orl-menu>
    </mat-toolbar-row>
  </mat-toolbar>
  `,
  styles: [ `
  .spacer {
    flex: 1 1 auto;
  }

  .docs-orlando-logo {
    width: 44px;
    height: 44px;
    margin: 0 4px 3px 0;
    vertical-align: middle;
  }

  .docs-button[md-button],
  .docs-button[md-raised-button] {
    text-transform: uppercase;
    padding: 0px;

    span {
      font-size: 16px;
    }
  }
  `,
  ]
})
export class ToolbarComponent {
  @Output() openMenu = new EventEmitter();
}
