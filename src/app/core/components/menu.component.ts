import { Component } from '@angular/core';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'orl-menu',
  template: `
  <mat-menu #menu="matMenu" (keydown.escape)="menu.close()">
    <button mat-menu-item [routerLink]="['/search']">
      <mat-icon>search</mat-icon>
      <span>Search</span>
    </button>
    <button mat-menu-item [routerLink]="['/about']">
      <mat-icon>info</mat-icon>
      <span>About</span>
    </button>
  </mat-menu>
`,
})
export class MenuComponent {
}
