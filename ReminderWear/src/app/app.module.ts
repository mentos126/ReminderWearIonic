import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { TabsPage } from '../pages/tabs/tabs';
import { SportPage } from '../pages/sport/sport';
import { HomePage } from '../pages/home/home';

import { AddTaskPage } from '../pages/add-task/add-task';
import { EditTaskPage } from '../pages/edit-task/edit-task';
import { AddCategoryPage } from '../pages/add-category/add-category';
import { EditCategoryPage } from '../pages/edit-category/edit-category';
import { SportDetailPage } from '../pages/sport-detail/sport-detail';
import { ModalCategoryPage } from '../pages/modal-category/modal-category';
import { ModalIconPage } from '../pages/modal-icon/modal-icon';
import { ModalMapPage } from '../pages/modal-map/modal-map';
import { ShowTaskPage } from '../pages/show-task/show-task';
import { SportActivityPage } from '../pages/sport-activity/sport-activity';

import { Camera } from '@ionic-native/camera';
import { Geolocation } from '@ionic-native/geolocation';
import { LocalNotifications  } from '@ionic-native/local-notifications';
import { Diagnostic } from '@ionic-native/diagnostic';

import { ChartsModule } from 'ng2-charts';
import { ColorPickerModule } from 'ngx-color-picker';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TaskerServiceProvider } from '../providers/tasker-service/tasker-service';

import { GoogleMapComponent } from '../components/google-map/google-map';
import { MapServiceProvider } from '../providers/map-service/map-service';

import {} from '@types/googlemaps';


@NgModule({
  declarations: [
    MyApp,
    SportPage,
    HomePage,
    TabsPage,
    AddTaskPage,
    EditTaskPage,
    AddCategoryPage,
    EditCategoryPage,
    SportDetailPage,
    ModalCategoryPage,
    ModalIconPage,
    ModalMapPage,
    ShowTaskPage,
    GoogleMapComponent,
    SportActivityPage
  ],
  imports: [
    BrowserModule,
    ColorPickerModule,
    IonicModule.forRoot(MyApp),
    ChartsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SportPage,
    HomePage,
    TabsPage,
    AddTaskPage,
    EditTaskPage,
    AddCategoryPage,
    EditCategoryPage,
    SportDetailPage,
    ModalCategoryPage,
    ModalIconPage,
    ModalMapPage,
    ShowTaskPage,
    SportActivityPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    TaskerServiceProvider,
    Camera,
    Geolocation,
    MapServiceProvider,
    LocalNotifications,
    Diagnostic
  ]
})
export class AppModule {}
