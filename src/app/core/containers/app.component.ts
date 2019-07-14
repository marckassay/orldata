import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'orl-app',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-header class="mat-elevation-z6"></app-header>
    <router-outlet></router-outlet>
    <app-footer></app-footer>
  `,
  styleUrls: ['app.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  constructor(
    private iconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.iconRegistry.addSvgIcon(
      'github_circle_white',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/github-circle-white-transparent.svg')
    );

    this.iconRegistry.addSvgIcon(
      'orlando_fountain',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/img/orlando-fountain.svg')
    );
  }
}
