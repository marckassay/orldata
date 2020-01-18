import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { BroadcastService } from '@azure/msal-angular';
import { Subscription } from 'rxjs';

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
export class AppComponent implements OnInit, OnDestroy {
  private subscription: Subscription;

  constructor(
    private iconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private broadcastService: BroadcastService
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

    this.broadcastService.subscribe('msal:loginFailure', (payload) => {
      // do something here
    });

    this.broadcastService.subscribe('msal:loginSuccess', (payload) => {
      // do something here
    });

    this.broadcastService.subscribe('msal:acquireTokenSuccess', (payload) => {
      // do something here
    });

    this.broadcastService.subscribe('msal:acquireTokenFailure', (payload) => {
      // do something here
    });

    this.subscription = this.broadcastService.subscribe('msal:acquireTokenFailure', (payload) => {
    });
  }

  ngOnDestroy() {
    this.broadcastService.getMSALSubject().next(1);
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
