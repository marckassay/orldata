import { Component } from '@angular/core';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'orl-footer',
  template: `
<footer class="docs-footer">
  <div class="docs-footer-list">
    <div class="docs-footer-logo">
      <div class="footer-logo">
          <mat-icon svgIcon="github_circle_white"></mat-icon>

      <img class="docs-orlando-logo"
          src="./assets/orlando_open_data_white.png"
          alt="orlando open data">
        <span><a href="https://angular.io">Learn Angular</a></span>
      </div>
    </div>

    <div class="docs-footer-version">
      <span class="version">Current Version: {{version}}</span>
    </div>

    <div class="docs-footer-copyright">
      <span>Powered by Google ©2010-2018.</span>
      <span>Code licensed under an MIT-style License.</span>
      <span>Documentation licensed under CC BY 4.0.</span>
    </div>
  </div>
</footer>
  `,
  styles: [`
    .docs-orlando-logo {
    height: 44px;
    margin: 0 4px 3px 0;
    vertical-align: middle;
  }

.docs-footer-list {
  align-items: center;
  display: flex;
  flex-flow: row wrap;
  padding: 8px;
}

.docs-footer-logo {
  flex: 1;
}

.docs-footer-angular-logo {
  height: 50px;
}

.docs-footer-version {
  flex: 1;
  text-align: center;
}

.docs-footer-copyright {
  display: flex;
  flex: 1;
  justify-content: flex-end;
  flex-direction: column;
  min-width: 225px;
  text-align: center;
}

.docs-footer-logo span {
  display: inline-block;
  line-height: 50px;
  margin: 0 40px;
  vertical-align: bottom;

  a {
    font-size: 16px;
    padding: 0;
    text-decoration: none;
    color: inherit;

    &:hover {
      text-decoration: underline;
    }
  }
}

@media screen and (max-width: 884px){
  .docs-footer-list {
    flex-direction: column;
  }
}
  `,
  ]
})
export class FooterComponent {

  version = 1;
}
