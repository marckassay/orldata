import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'orl-permit-viewer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-viewer></app-page-viewer>
  `,
  encapsulation: ViewEncapsulation.None
})
export class PermitComponent {

  constructor(public router: Router,
              public route: ActivatedRoute) {

  }
}
