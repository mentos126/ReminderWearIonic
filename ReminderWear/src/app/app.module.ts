import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { SportPage } from '../pages/sport/sport';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

// ADDED
import { AddTaskPage } from '../pages/add-task/add-task';
import { EditTaskPage } from '../pages/edit-task/edit-task';
import { AddCategoryPage } from '../pages/add-category/add-category';
import { EditCategoryPage } from '../pages/edit-category/edit-category';
import { SportDetailPage } from '../pages/sport-detail/sport-detail';
import { ModalCategoryPage } from '../pages/modal-category/modal-category';
import { ModalIconPage } from '../pages/modal-icon/modal-icon';


import {ColorPickerModule} from 'primeng/colorpicker';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TaskerServiceProvider } from '../providers/tasker-service/tasker-service';

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
    ModalIconPage
  ],
  imports: [
    BrowserModule,
    ColorPickerModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(MyApp)
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
    ModalIconPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    TaskerServiceProvider
  ]
})
export class AppModule {}
