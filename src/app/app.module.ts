import { LayoutModule } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy } from '@angular/router';
import { MsalInterceptor, MsalModule } from '@azure/msal-angular';
import { EffectsModule } from '@ngrx/effects';
import { NavigationActionTiming, RouterState, StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { Logger } from 'msal';
import { AppRouteStrategy } from './app-route-strategy';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './core/containers/app.component';
import { CoreModule } from './core/core.module';
import { RouterEffects } from './core/effects/router.effects';
import { StyleManager } from './core/shared/style-manager';
import { ThemePickerModule } from './core/shared/theme-picker';
import { metaReducers, ROOT_REDUCERS } from './reducers';

// tslint:disable-next-line: variable-name
export function loggerCallback(_logLevel: any, message: any, _piiEnabled: any) {
  // tslint:disable-next-line: prefer-template
  console.log('client logging' + message);
}

export const protectedResourceMap: Array<[string, Array<string>]> = [
  ['https://buildtodoservice.azurewebsites.net/api/todolist', ['api://a88bb933-319c-41b5-9f04-eff36d985612/access_as_user']],
  ['https://graph.microsoft.com/v1.0/me', ['user.read']]
];

const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    LayoutModule,
    HttpClientModule,
    AppRoutingModule,

    /**
     * StoreModule.forRoot is imported once in the root module, accepting a reducer
     * function or object map of reducer functions. If passed an object of
     * reducers, combineReducers will be run creating your application
     * meta-reducer. This returns all providers for an @ngrx/store
     * based application.
     */
    StoreModule.forRoot(ROOT_REDUCERS, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
        strictStateSerializability: true,
        strictActionSerializability: true,
      },
    }),

    /**
     * @ngrx/router-store keeps router state up-to-date in the store.
     */
    StoreRouterConnectingModule.forRoot({
      routerState: RouterState.Minimal,
      navigationActionTiming: NavigationActionTiming.PreActivation,
    }),
    HttpClientModule,
    MsalModule.forRoot({
      auth: {
        clientId: '6226576d-37e9-49eb-b201-ec1eeb0029b6',
        authority: 'https://login.microsoftonline.com/common/',
        validateAuthority: true,
        redirectUri: 'http://localhost:4200/',
        postLogoutRedirectUri: 'http://localhost:4200/',
        navigateToLoginRequestUrl: true,
      },
      cache: {
        cacheLocation: 'localStorage',
        storeAuthStateInCookie: isIE, // set to true for IE 11
      },
      framework: {
        unprotectedResources: ['https://www.microsoft.com/en-us/'],
        protectedResourceMap: new Map(protectedResourceMap)
      },
      system: {
        logger: new Logger(loggerCallback)
      }
    },
      {
        popUp: !isIE,
        consentScopes: ['user.read', 'openid', 'profile', 'api://a88bb933-319c-41b5-9f04-eff36d985612/access_as_user'],
        extraQueryParameters: {}
      }
    ),
    /**
     * Store devtools instrument the store retaining past versions of state
     * and recalculating new states. This enables powerful time-travel
     * debugging.
     *
     * To use the debugger, install the Redux Devtools extension for either
     * Chrome or Firefox
     *
     * See: https://github.com/zalmoxisus/redux-devtools-extension
     */
    /*     StoreDevtoolsModule.instrument({
          name: 'NgRx - orldata',
        }), */

    EffectsModule.forRoot(
      [RouterEffects]
    ),

    CoreModule,
    ThemePickerModule
  ],
  providers: [
    StyleManager,
    { provide: HTTP_INTERCEPTORS, useClass: MsalInterceptor, multi: true },
    { provide: RouteReuseStrategy, useClass: AppRouteStrategy }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
