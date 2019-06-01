import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'orl-app',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <orl-layout>
    <orl-toolbar></orl-toolbar>
    <orl-body></orl-body>
    <orl-footer></orl-footer>
    <router-outlet></router-outlet>
  </orl-layout>
  `
})
export class AppComponent implements OnInit {
  constructor(private router: Router,
              private iconRegistry: MatIconRegistry,
              private domSanitizer: DomSanitizer
    ) {
  }

  ngOnInit(): void {
   // this.router.navigate(['/permit']);
    this.iconRegistry.addSvgIcon(
      'github_circle_white',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/github-circle-white-transparent.svg')
    );

    this.iconRegistry.addSvgIcon(
      'orlando_open_data_fountain',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/orlando-open-data-fountain.svg')
    );
  }
}
