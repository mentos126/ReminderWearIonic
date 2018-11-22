import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SportActivityPage } from './sport-activity';

@NgModule({
  declarations: [
    SportActivityPage,
  ],
  imports: [
    IonicPageModule.forChild(SportActivityPage),
  ],
})
export class SportActivityPageModule {}
