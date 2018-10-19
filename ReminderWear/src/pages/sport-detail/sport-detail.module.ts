import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SportDetailPage } from './sport-detail';

@NgModule({
  declarations: [
    SportDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(SportDetailPage),
  ],
})
export class SportDetailPageModule {}
