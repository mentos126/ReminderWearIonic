import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShowTaskPage } from './show-task';

@NgModule({
  declarations: [
    ShowTaskPage,
  ],
  imports: [
    IonicPageModule.forChild(ShowTaskPage),
  ],
})
export class ShowTaskPageModule {}
