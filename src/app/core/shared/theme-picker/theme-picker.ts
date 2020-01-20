import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, Injectable, NgModule, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StyleManager } from '../style-manager/style-manager';
import { DocsSiteTheme, ThemeStorage } from './theme-storage/theme-storage';

@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'theme-picker',
  templateUrl: 'theme-picker.html',
  styleUrls: ['theme-picker.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class ThemePickerComponent implements OnInit, OnDestroy {
  @HostBinding('attr.aria-hidden') hidden = true;

  private queryParamSubscription = Subscription.EMPTY;
  currentTheme: DocsSiteTheme;

  themes: Array<DocsSiteTheme> = [
    {
      primary: '#673AB7',
      accent: '#FFC107',
      name: 'deeppurple-amber',
      isDark: false,
    },
    {
      primary: '#3F51B5',
      accent: '#E91E63',
      name: 'indigo-pink',
      isDark: false,
      isDefault: true,
    },
    {
      primary: '#E91E63',
      accent: '#607D8B',
      name: 'pink-bluegrey',
      isDark: true,
    },
    {
      primary: '#9C27B0',
      accent: '#4CAF50',
      name: 'purple-green',
      isDark: true,
    },
  ];

  constructor(
    public styleManager: StyleManager,
    public themeStorage: ThemeStorage,
    private activatedRoute: ActivatedRoute) {
    this.installTheme(this.themeStorage.getStoredThemeName());
  }

  ngOnInit() {
    this.queryParamSubscription = this.activatedRoute.queryParamMap.pipe(
      map(params => params.get('theme')),
      filter(Boolean),
    ).subscribe(themeName => this.installTheme(themeName));
  }

  ngOnDestroy() {
    this.queryParamSubscription.unsubscribe();
  }

  installTheme(themeName: string | unknown) {
    if (!themeName) {
      return;
    }
    const theme = this.themes.find(currentTheme => currentTheme.name === themeName);

    if (!theme) {
      return;
    }

    this.currentTheme = theme;

    if (theme.isDefault) {
      this.styleManager.removeStyle('theme');
    } else {
      this.styleManager.setStyle('theme', `assets/${theme.name}.css`);
    }

    if (this.currentTheme) {
      this.themeStorage.storeTheme(this.currentTheme);
    }
  }
}

@NgModule({
  imports: [
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatGridListModule,
    MatTooltipModule,
    CommonModule
  ],
  exports: [ThemePickerComponent],
  declarations: [ThemePickerComponent],
  providers: [StyleManager, ThemeStorage],
})
export class ThemePickerModule { }
