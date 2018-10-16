import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddCategoryPage } from './add-category';

@NgModule({
  declarations: [
    AddCategoryPage,
  ],
  imports: [
    IonicPageModule.forChild(AddCategoryPage),
  ],
})
export class AddCategoryPageModule {}
