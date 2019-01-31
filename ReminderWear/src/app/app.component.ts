import {Component} from '@angular/core';
import {Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

import {TabsPage} from '../pages/tabs/tabs';
import {SQLitePersistor} from '../Tasker/SQLitePersistor';
import {SQLite} from '@ionic-native/sqlite';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = TabsPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, sqlite: SQLite) {
    platform.ready().then(() => {
      SQLitePersistor.initInstance(sqlite);
      statusBar.styleLightContent();
      statusBar.backgroundColorByHexString('#40ccdf');
      splashScreen.hide();

    });
  }
}
