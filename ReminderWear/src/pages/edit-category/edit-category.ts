import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController,
  ModalController
} from 'ionic-angular';
import {
  TaskerServiceProvider
} from '../../providers/tasker-service/tasker-service';
import {
  Category
} from '../../Tasker/Category';
import { Tasker } from '../../Tasker/Tasker';
import {
  ISubscription
} from 'rxjs/Subscription';
import { ModalIconPage } from '../modal-icon/modal-icon';

/**
 * Generated class for the EditCategoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-category',
  templateUrl: 'edit-category.html',
})
export class EditCategoryPage implements OnInit, OnDestroy {

  private recevCat: Category;
  private subscription: ISubscription;

  private myColor = '#ca3433';
  private myTitle = '';
  private myIcon = '';

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController,
    private toastCtrl: ToastController, private taskService: TaskerServiceProvider) {}

    ngOnInit(): void {
      this.subscription = this.taskService
      .currentCategory
      .subscribe(res => {
        this.recevCat = res;
        this.myTitle = this.recevCat.getName();
        this.myIcon = this.recevCat.getIcon();
        this.myColor = this.recevCat.getColor();
      });
    }

    ngOnDestroy(): void {
      this.subscription.unsubscribe();
    }

  ionViewDidLoad() { }

  launchToast(message: string): void {
    const toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.onDidDismiss(this.dismissHandler);
    toast.present();
  }

  private dismissHandler() {}

  save() {
    if (this.myTitle !== '') {
      if (this.myIcon !== '') {
        if (this.myColor !== '') {
          const newCategory = new Category(this.myTitle, this.myIcon, this.myColor);
          console.log('edit category :: save');
          Tasker.getInstance().editCategoryById(this.recevCat.getID(), newCategory);
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

  cancel() {
    this.navCtrl.pop();
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

}
