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
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      // console.log('SQL', sqlite.selfTest() );

      // SQLitePersistor.initInstance(sqlite);
      // SQLitePersistor.getInstance().getDatabaseState().subscribe((ready) => {
      //   if (ready) {
      //     console.log('SQL Init complete');
      SQLitePersistor.initInstance(sqlite);
          statusBar.styleDefault();
          splashScreen.hide();
      //   }
      // });




    });
  }
}
