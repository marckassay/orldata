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
import { environment } from 'src/environments/environment';
import { AppRouteStrategy } from './app-route-strategy';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './core/containers/app.component';
import { CoreModule } from './core/core.module';
import { MsalEffects } from './core/effects/msal.effects';
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
  ['https://graph.microsoft.com/', ['offline_access', 'openid']],
  ['https://orldatab2c.onmicrosoft.com/api/', ['user.read', 'user.write']]
];

export const unprotectedResources: Array<string> = [
  'https://dev.socrata.com/foundry/data.cityoforlando.net',
  'https://www.github.com',
  'https://data.cityoforlando.net'
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

    MsalModule.forRoot({
      /**
       * AuthOptions: Use this to configure the auth options in the Configuration object
       *
       * clientId
       * Client ID of your app registered that has access to webapi application.
       * I'm using orldata-b2c
       *
       * authority
       * You can configure a specific authority, defaults to " " or "https://login.microsoftonline.com/common"
       * See this link on why not to use the 'login.microsoftonline.com/common':
       * https://docs.microsoft.com/en-us/azure/active-directory-b2c/b2clogin#deprecation-of-loginmicrosoftonlinecom
       * I'm using the value-format from this doc:
       * https://docs.microsoft.com/en-us/azure/active-directory-b2c/active-directory-b2c-tutorials-spa?tabs=applications#update-the-sample
       *
       * validateAuthority
       * Used to turn authority validation on/off. When set to true (default), MSAL will compare the application's authority against
       * well-known URLs templates representing well-formed authorities. It is useful when the authority is obtained at run time to prevent
       * MSAL from displaying authentication prompts from malicious pages.
       *
       * redirectUri
       * The redirect URI of the application, this should be same as the value in the application registration portal.
       * Defaults to `window.location.href`.
       *
       * postLogoutRedirectUri
       * Used to redirect the user to this location after logout. Defaults to `window.location.href`.
       *
       * navigateToLoginRequestUrl
       * Used to turn off default navigation to start page after login. Default is true. This is used only for redirect flows.
       *
       */
      auth: {
        clientId: environment.azure.clientId,
        authority: environment.azure.authority,
        validateAuthority: false,
        redirectUri: environment.azure.redirectUri,
        postLogoutRedirectUri: environment.azure.postLogoutRedirectUri,
        navigateToLoginRequestUrl: true,
      },
      /**
       * Use this to configure the below cache configuration options:
       *
       * cacheLocation
       * Used to specify the cacheLocation user wants to set. Valid values are "localStorage" and "sessionStorage"
       *
       * storeAuthStateInCookie
       * If set, MSAL store's the auth request state required for validation of the auth flows in the browser cookies. By default
       * this flag is set to false.
       */
      cache: {
        cacheLocation: 'localStorage',
        storeAuthStateInCookie: isIE,
      },
      /**
       * App/Framework specific environment support
       *
       * isAngular
       * flag set to determine if it is Angular Framework. MSAL uses this to broadcast tokens. More to come here: detangle this
       * dependency from core.
       *
       * unprotectedResources
       * Array of URI's which are unprotected resources. MSAL will not attach a token to outgoing requests that have these URI. Defaults to
       * 'null'.
       *
       * protectedResourceMap
       * This is mapping of resources to scopes used by MSAL for automatically attaching access tokens in web API calls. A single access
       * token is obtained for the resource. So you can map a specific resource path as follows: {"https://graph.microsoft.com/v1.0/me",
       * ["user.read"]}, or the app URL of the resource as: {"https://graph.microsoft.com/", ["user.read", "mail.send"]}. This is required
       * for CORS calls.
       */
      framework: {
        isAngular: true,
        unprotectedResources,
        protectedResourceMap: new Map(protectedResourceMap)
	}/*,
      system: {
        logger: new Logger(loggerCallback)
	}*/
    },
      {
        popUp: !isIE,
        consentScopes: ['user.read', 'user.write', 'openid', 'offline_access'],
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
    /*
    storeDevtoolsModule.instrument({
      name: 'NgRx - orldata',
    }),
    */
    EffectsModule.forRoot([
      MsalEffects,
      RouterEffects,
    ]),
    ThemePickerModule,
    CoreModule
  ],
  providers: [
    StyleManager,
    { provide: HTTP_INTERCEPTORS, useClass: MsalInterceptor, multi: true },
    { provide: RouteReuseStrategy, useClass: AppRouteStrategy }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
