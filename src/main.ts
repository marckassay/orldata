import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import 'hammerjs';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
} else {
console.clear();
console.log('   ____        ______        __          ');
console.log('  / __ \\_____ / / __ \\______/ /_______ ');
console.log(' / / / / ___ / / / / / __  / __/ __  /   ');
console.log('/ /_/ / /   / / /_/ / /_/ / /_/ /_/ /    ');
console.log('\\____/_/   /_/_____/\\__,_/\\__/\\__,_/ ');
console.log('                                         ');
console.log('The environment configuration for this session is set to dev.');
console.log('');
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
