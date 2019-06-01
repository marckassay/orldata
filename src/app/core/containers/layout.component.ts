import { Component } from '@angular/core';

@Component({
  selector: 'orl-layout',
  template: `
    <ng-container fullscreen>

      <ng-content></ng-content>

    </ng-container>
  `
})
export class LayoutComponent { }
