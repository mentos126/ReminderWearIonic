import {
  Component
} from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController
} from 'ionic-angular';
import {
  Category
} from '../../Tasker/Category';

/**
 * Generated class for the ModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-category',
  templateUrl: 'modal-category.html',
})
export class ModalCategoryPage {

  myCats: Category[];
  myCat: Category = null;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    this.myCats = navParams.get('myParam');
  }

  ionViewDidLoad() {}

  selectItem(c: Category) {
    this.myCat = c;
    this.dismiss();
  }

  dismiss() {
    this.viewCtrl.dismiss(this.myCat);
  }

}
