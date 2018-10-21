import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalMapPage } from './modal-map';

@NgModule({
  declarations: [
    ModalMapPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalMapPage),
  ],
})
export class ModalMapPageModule {}
