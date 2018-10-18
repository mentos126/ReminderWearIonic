import {
  Component
} from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController
} from 'ionic-angular';
import {
  TaskerServiceProvider
} from '../../providers/tasker-service/tasker-service';
import {
  Category
} from '../../Tasker/Category';
import { Tasker } from '../../Tasker/Tasker';

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
export class EditCategoryPage {

  private recevCat: Category;

  private myColor = '#ca3433';
  private myTitle = '';
  private myIcon = '';

  listIcons = ['ion-ios-add',
    'ion-ios-add-circle',
    'ion-ios-alarm',
    'ion-ios-albums',
    'ion-ios-alert',
    'ion-ios-american-football',
    'ion-ios-analytics',
    'ion-ios-aperture',
    'ion-ios-apps',
    'ion-ios-appstore',
    'ion-ios-archive',
    'ion-ios-arrow-back',
    'ion-ios-arrow-down',
    'ion-ios-arrow-dropdown',
    'ion-ios-arrow-dropdown-circle',
    //  'ion-ios-arrow-dropleft',
    //  'ion-ios-arrow-dropleft-circle',
    //  'ion-ios-arrow-dropright',
    //  'ion-ios-arrow-dropright-circle',
    //  'ion-ios-arrow-dropup',
    //  'ion-ios-arrow-dropup-circle',
    //  'ion-ios-arrow-forward',
    //  'ion-ios-arrow-round-back',
    //  'ion-ios-arrow-round-down',
    //  'ion-ios-arrow-round-forward',
    //  'ion-ios-arrow-round-up',
    //  'ion-ios-arrow-up',
    //  'ion-ios-at',
    //  'ion-ios-attach',
    //  'ion-ios-backspace',
    //  'ion-ios-barcode',
    //  'ion-ios-baseball',
    //  'ion-ios-basket',
    //  'ion-ios-basketball',
    //  'ion-ios-battery-charging',
    //  'ion-ios-battery-dead',
    //  'ion-ios-battery-full',
    //  'ion-ios-beaker',
    //  'ion-ios-beer',
    //  'ion-ios-bicycle',
    //  'ion-ios-bluetooth',
    //  'ion-ios-boat',
    //  'ion-ios-body',
    //  'ion-ios-bonfire',
    //  'ion-ios-book',
    //  'ion-ios-bookmark',
    //  'ion-ios-bookmarks',
    //  'ion-ios-bowtie',
    //  'ion-ios-briefcase',
    //  'ion-ios-browsers',
    //  'ion-ios-brush',
    //  'ion-ios-bug',
    //  'ion-ios-build',
    //  'ion-ios-bulb',
    //  'ion-ios-bus',
    //  'ion-ios-cafe',
    //  'ion-ios-calculator',
    //  'ion-ios-calendar',
    //  'ion-ios-call',
    //  'ion-ios-camera',
    //  'ion-ios-car',
    //  'ion-ios-card',
    //  'ion-ios-cart',
    //  'ion-ios-cash',
    //  'ion-ios-chatboxes',
    //  'ion-ios-chatbubbles',
    //  'ion-ios-checkbox',
    //  'ion-ios-checkmark',
    //  'ion-ios-checkmark-circle',
    //  'ion-ios-clipboard',
    //  'ion-ios-clock',
    //  'ion-ios-close',
    //  'ion-ios-close-circle',
    //  'ion-ios-cloud',
    //  'ion-ios-cloud-circle',
    //  'ion-ios-cloud-done',
    //  'ion-ios-cloud-download',
    //  'ion-ios-cloud-upload',
    //  'ion-ios-cloudy',
    //  'ion-ios-cloudy-night',
    //  'ion-ios-code',
    //  'ion-ios-code-download',
    //  'ion-ios-code-working',
    //  'ion-ios-cog',
    //  'ion-ios-color-fill',
    //  'ion-ios-color-filter',
    //  'ion-ios-color-palette',
    //  'ion-ios-color-wand',
    //  'ion-ios-compass',
    //  'ion-ios-construct',
    //  'ion-ios-contact',
    //  'ion-ios-contacts',
    //  'ion-ios-contract',
    //  'ion-ios-contrast',
    //  'ion-ios-copy',
    //  'ion-ios-create',
    //  'ion-ios-crop',
    //  'ion-ios-cube',
    //  'ion-ios-cut',
    //  'ion-ios-desktop',
    //  'ion-ios-disc',
    //  'ion-ios-document',
    //  'ion-ios-done-all',
    //  'ion-ios-download',
    //  'ion-ios-easel',
    //  'ion-ios-egg',
    //  'ion-ios-exit',
    //  'ion-ios-expand',
    //  'ion-ios-eye',
    //  'ion-ios-eye-off',
    //  'ion-ios-fastforward',
    //  'ion-ios-female',
    //  'ion-ios-filing',
    //  'ion-ios-film',
    //  'ion-ios-finger-print',
    //  'ion-ios-flag',
    //  'ion-ios-flame',
    //  'ion-ios-flash',
    //  'ion-ios-flask',
    //  'ion-ios-flower',
    //  'ion-ios-folder',
    //  'ion-ios-folder-open',
    //  'ion-ios-football',
    //  'ion-ios-funnel',
    //  'ion-ios-game-controller-a',
    //  'ion-ios-game-controller-b',
    //  'ion-ios-git-branch',
    //  'ion-ios-git-commit',
    //  'ion-ios-git-compare',
    //  'ion-ios-git-merge',
    //  'ion-ios-git-network',
    //  'ion-ios-git-pull-request',
    //  'ion-ios-glasses',
    //  'ion-ios-globe',
    //  'ion-ios-grid',
    //  'ion-ios-hammer',
    //  'ion-ios-hand',
    //  'ion-ios-happy',
    //  'ion-ios-headset',
    //  'ion-ios-heart',
    //  'ion-ios-help',
    //  'ion-ios-help-buoy',
    //  'ion-ios-help-circle',
    //  'ion-ios-home',
    //  'ion-ios-ice-cream',
    //  'ion-ios-image',
    //  'ion-ios-images',
    //  'ion-ios-infinite',
    //  'ion-ios-jet',
    //  'ion-ios-key',
    //  'ion-ios-keypad',
    //  'ion-ios-laptop',
    //  'ion-ios-leaf',
    //  'ion-ios-link',
    //  'ion-ios-list',
    //  'ion-ios-list-box',
    //  'ion-ios-locate',
    //  'ion-ios-lock',
    //  'ion-ios-log-in',
    //  'ion-ios-log-out',
    //  'ion-ios-magnet',
    //  'ion-ios-mail',
    //  'ion-ios-mail-open',
    //  'ion-ios-male',
    //  'ion-ios-man',
    //  'ion-ios-map',
    //  'ion-ios-medal',
    //  'ion-ios-medical',
    //  'ion-ios-medkit',
    //  'ion-ios-megaphone',
    //  'ion-ios-menu',
    //  'ion-ios-mic',
    //  'ion-ios-mic-off',
    //  'ion-ios-microphone',
    //  'ion-ios-moon',
    //  'ion-ios-more',
    //  'ion-ios-move',
    //  'ion-ios-musical-note',
    //  'ion-ios-musical-notes',
    //  'ion-ios-navigate',
    //  'ion-ios-no-smoking',
    //  'ion-ios-nuclear',
    //  'ion-ios-open',
    //  'ion-ios-outlet',
    //  'ion-ios-paper',
    //  'ion-ios-paper-plane',
    //  'ion-ios-partly-sunny',
    //  'ion-ios-pause',
    //  'ion-ios-paw',
    //  'ion-ios-people',
    //  'ion-ios-person',
    //  'ion-ios-person-add',
    //  'ion-ios-phone-landscape',
    //  'ion-ios-phone-portrait',
    //  'ion-ios-photos',
    //  'ion-ios-pie',
    //  'ion-ios-pin',
    //  'ion-ios-pint',
    //  'ion-ios-pizza',
    //  'ion-ios-plane',
    //  'ion-ios-planet',
    //  'ion-ios-play',
    //  'ion-ios-podium',
    //  'ion-ios-power',
    //  'ion-ios-pricetag',
    //  'ion-ios-pricetags',
    //  'ion-ios-print',
    //  'ion-ios-pulse',
    //  'ion-ios-qr-scanner',
    //  'ion-ios-quote',
    //  'ion-ios-radio',
    //  'ion-ios-radio-button-off',
    //  'ion-ios-radio-button-on',
    //  'ion-ios-rainy',
    //  'ion-ios-recording',
    //  'ion-ios-redo',
    //  'ion-ios-refresh',
    //  'ion-ios-refresh-circle',
    //  'ion-ios-remove',
    //  'ion-ios-remove-circle',
    //  'ion-ios-reorder',
    //  'ion-ios-repeat',
    //  'ion-ios-resize',
    //  'ion-ios-restaurant',
    //  'ion-ios-return-left',
    //  'ion-ios-return-right',
    //  'ion-ios-reverse-camera',
    //  'ion-ios-rewind',
    //  'ion-ios-ribbon',
    //  'ion-ios-rose',
    //  'ion-ios-sad',
    //  'ion-ios-school',
    //  'ion-ios-search',
    //  'ion-ios-send',
    //  'ion-ios-settings',
    //  'ion-ios-share',
    //  'ion-ios-share-alt',
    //  'ion-ios-shirt',
    //  'ion-ios-shuffle',
    //  'ion-ios-skip-backward',
    //  'ion-ios-skip-forward',
    //  'ion-ios-snow',
    //  'ion-ios-speedometer',
    //  'ion-ios-square',
    //  'ion-ios-star',
    //  'ion-ios-star-half',
    //  'ion-ios-stats',
    //  'ion-ios-stopwatch',
    //  'ion-ios-subway',
    //  'ion-ios-sunny',
    //  'ion-ios-swap',
    //  'ion-ios-switch',
    //  'ion-ios-sync',
    //  'ion-ios-tablet-landscape',
    //  'ion-ios-tablet-portrait',
    //  'ion-ios-tennisball',
    //  'ion-ios-text',
    //  'ion-ios-thermometer',
    //  'ion-ios-thumbs-down',
    //  'ion-ios-thumbs-up',
    //  'ion-ios-thunderstorm',
    //  'ion-ios-time',
    //  'ion-ios-timer',
    //  'ion-ios-train',
    //  'ion-ios-transgender',
    //  'ion-ios-trash',
    //  'ion-ios-trending-down',
    //  'ion-ios-trending-up',
    //  'ion-ios-trophy',
    //  'ion-ios-umbrella',
    //  'ion-ios-undo',
    //  'ion-ios-unlock',
    //  'ion-ios-videocam',
    //  'ion-ios-volume-down',
    //  'ion-ios-volume-mute',
    //  'ion-ios-volume-off',
    //  'ion-ios-volume-up',
    //  'ion-ios-walk',
    //  'ion-ios-warning',
    //  'ion-ios-watch',
    //  'ion-ios-water',
    //  'ion-ios-wifi',
    //  'ion-ios-wine',
    //  'ion-ios-woman'
  ];


  constructor(public navCtrl: NavController, public navParams: NavParams,
    private toastCtrl: ToastController, private taskService: TaskerServiceProvider) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditCategoryPage');

    this.taskService
      .currentCategory
      .subscribe(res => {
        this.recevCat = res;
        this.myTitle = this.recevCat.getName();
        this.myIcon = this.recevCat.getIcon();
        this.myColor = this.recevCat.getColor();
      });

  }

  lunchToast(message: string): void {
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
          console.log(newCategory);
          Tasker.getInstance().editCategoryById(this.recevCat.getID(), newCategory);
          // Tasker.getListCategories().push(newCategory);
          Tasker.serializeLists();
          this.navCtrl.pop();
        } else {
          this.lunchToast('Sélectionné une couleur');
        }
      } else {
        this.lunchToast('Selectionné une icone');
      }
    } else {
      this.lunchToast('Ajouter un titre');
    }

  }

  cancel() {
    this.navCtrl.pop();
  }

}
