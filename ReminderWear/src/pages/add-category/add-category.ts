import {
  Component
} from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController,
  ModalController
} from 'ionic-angular';
import { Tasker } from '../../Tasker/Tasker';
import { Category } from '../../Tasker/Category';
import { ModalIconPage } from '../modal-icon/modal-icon';



/**
 * Generated class for the AddCategoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-category',
  templateUrl: 'add-category.html',
})
export class AddCategoryPage {

  private myColor = '#ca3433';
  private myTitle = '';
  private myIcon = 'ios-alarm';

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private toastCtrl: ToastController, public modalCtrl: ModalController) {}

  launchToast(message: string): void {
    const toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.onDidDismiss(this.dismissHandler);
    toast.present();
  }

  private dismissHandler() {
  }

  save() {
    if (this.myTitle !== '') {
      if (this.myIcon !== '') {
        if (this.myColor !== '') {
          const newCategory = new Category(this.myTitle, this.myIcon, this.myColor);
          Tasker.getListCategories().push(newCategory);
          Tasker.serializeLists();
          this.navCtrl.pop();
        } else {
          this.launchToast('Sélectionné une couleur');
        }
      } else {
        this.launchToast('Selectionné une icone');
      }
    } else {
      this.launchToast('Ajouter un titre');
    }

  }

  openIcons() {
    const myModal = this.modalCtrl.create(ModalIconPage, {cssClass: 'select-modal' });
    myModal.onDidDismiss(data => {
      if (data) {
        this.myIcon = data;
      }
    });
    myModal.present();
  }

  cancel() {
    this.navCtrl.pop();
  }

}
