import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalCategoryPage } from './modal-category';

@NgModule({
  declarations: [
    ModalCategoryPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalCategoryPage),
  ],
})
export class ModalPageModule {}
