import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';
import {
  NavController,
  ModalController,
  Platform,
  AlertController
} from 'ionic-angular';
import {
  AddTaskPage
} from '../add-task/add-task';
import {
  Tasker
} from '../../Tasker/Tasker';
import {
  Task
} from '../../Tasker/Task';
import {
  Category
} from '../../Tasker/Category';
import * as moment from 'moment';
import {
  EditTaskPage
} from '../edit-task/edit-task';
import {
  TaskerServiceProvider
} from '../../providers/tasker-service/tasker-service';
import {
  ISubscription
} from 'rxjs/Subscription';
import {
  Camera,
  CameraOptions
} from '@ionic-native/camera';
import {
  Coordinate
} from '../../Tasker/Coordinate';
import {
  ModalMapPage
} from '../modal-map/modal-map';
import {
  LocalNotifications
} from '@ionic-native/local-notifications';
import { ShowTaskPage } from '../show-task/show-task';
import { SportActivityPage } from '../sport-activity/sport-activity';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit, OnDestroy {

  private subscriptionTask: ISubscription;
  searchQuery = '';
  items: Task[];
  oldItems: Task[];
  orderBy = false;
  myCoordinate: Coordinate = null;

  constructor(public navCtrl: NavController,
    private taskService: TaskerServiceProvider,
    public modalCtrl: ModalController,
    private camera: Camera,
    private localNotifications: LocalNotifications,
    private plt: Platform,
    private alertCtrl: AlertController) {
    this.initializeItems();
    this.sort();

    this.plt.ready().then(() => {
      console.log('READY');
      this.localNotifications
        .on('click')
        .subscribe((res) => {
          const data = res.data.data;
          this.navCtrl.push(ShowTaskPage, data);
        });
    });
  }

// TODO DESTROY
goToRegister() {
this.navCtrl.push(SportActivityPage);
}
// TODO END DESTROY

  ngOnInit(): void {
    this.subscriptionTask = this.taskService
      .currentTask
      .subscribe();
  }

  ngOnDestroy(): void {
    this.subscriptionTask.unsubscribe();
  }

  ionViewDidLoad() {}

  initializeItems() {
    const t = new Tasker();
    Tasker.unserializeLists();

    // TODO REMOVE FROM
    Tasker.getListTasks();
    const c = new Category('Aucune', 'ios-add-circle', '#abcdef');
    const c2 = new Category(Tasker.CATEGORY_SPORT_TAG, 'ios-alarm', '#f5f5f5');
    t.addCategory(c);
    t.addCategory(c2);
    t.addTask(new Task('tache 1', 'description', c2, moment(), 0, moment().hours(), (moment().minutes() + 1) % 60));
    let i = 0;
    while (i < 10000000) {
      i++;
    }
    t.addTask(new Task('tache 2', 'description', c, null, 0, moment().hours(), (moment().minutes() + 2) % 60,
      [false, true, false, false, false, false, false]));
    i = 0;
    while (i < 10000000) {
      i++;
    }
    t.addTask(new Task('tache 3', 'description', c2, moment(), 0, moment().hours(), (moment().minutes() + 3) % 60));
    i = 0;
    while (i < 10000000) {
      i++;
    }
    t.addTask(new Task('tache 4', 'description', c, moment(), 0, moment().hours(), (moment().minutes() + 4) % 60));
    // TODO END REMOVE

    this.items = Tasker.getListTasks();

    console.log('items', this.items);
    console.log(Tasker.getListTasks());

  }

  getItems(ev: any) {
    this.items = Tasker.getListTasks();
    this.oldItems = [];
    const val = ev.target.value;
    if (val && val.trim() !== '') {
      this.items = this.items.filter((item) => {
        if (item.getNextDate().valueOf() < moment().valueOf()) {
          this.oldItems.push(item);
          return false;
        }
        if (item.getName().toLowerCase().indexOf(val.toLowerCase()) > -1) {
          return true;
        }
        if (item.getDescription().toLowerCase().indexOf(val.toLowerCase()) > -1) {
          return true;
        }
        if (item.getCategory().getName().toLowerCase().indexOf(val.toLowerCase()) > -1) {
          return true;
        }
        if (item.getNextDate().format('DD MMM. YYYY').toLowerCase().indexOf(val.toLowerCase()) > -1) {
          return true;
        }
        return false;
      });
    }



  }

  delete(item: Task) {
    Tasker.removeTask(item);
  }

  onItemClicked(id: number) {
    this.taskService.changeTask(Tasker.getTaskByID(id));
    this.navCtrl.push(EditTaskPage);
  }

  onChangeActivated(id: number) {
    const temp = Tasker.getTaskByID(id);
    temp.setIsActivatedNotification(!temp.getIsActivatedNotification());
  }

  addTask() {
    this.navCtrl.push(AddTaskPage);
  }

  sort(): void {
    if (this.items !== undefined && this.items.length > 0) {
      this.orderBy = !this.orderBy;
      this.items.sort((n1, n2) => {
        if (this.orderBy) {
          if (n1.getNextDate().isAfter(n2.getNextDate())) {
            return 1;
          }
          if (n1.getNextDate().isBefore(n2.getNextDate())) {
            return -1;
          }
        } else {
          if (n1.getNextDate().isBefore(n2.getNextDate())) {
            return 1;
          }
          if (n1.getNextDate().isAfter(n2.getNextDate())) {
            return -1;
          }
        }
        return 0;
      });
    }
  }

  eventStopPropagation($event: any) {
    $event.stopPropagation();
  }

  takePhoto($event: any, id: number) {
    this.eventStopPropagation($event);

    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(options).then((imageData) => {
      const t: Task = Tasker.getTaskByID(id);
      t.setPhoto('data:image/jpeg;base64,' + imageData);
    }, (err) => {
      console.error(err);
    });

  }

  selectLocalisation($event: any, id: number) {
    this.eventStopPropagation($event);

    this.myCoordinate = null;
    const myModal = this.modalCtrl.create(ModalMapPage, {
      cssClass: 'select-modal'
    });
    myModal.onDidDismiss(data => {
      if (data) {
        this.myCoordinate = data;
        const t: Task = Tasker.getTaskByID(id);
        t.setLocalisation(this.myCoordinate);
      }
    });
    myModal.present();
  }

  lunchLocalNotification() {
    let temp: Task = null;
    for (const t of Tasker.getListTasks()) {
      if (t.getIsActivatedNotification()) {
        if (temp === null || t.getNextDate().valueOf() < temp.getNextDate().valueOf()) {
          temp = t;
        }
      }
    }
    const temp2: any = temp.getDateDeb();
    temp.setDateDeb(temp.getNextDate());

    if (temp !== null) {
      this.localNotifications.schedule({
        id: temp.getID(),
        title: temp.getName(),
        text: temp.getDescription(),
        trigger: {
          at: new Date(temp.getNextDate().valueOf())
        },
        led: 'FF0000',
        icon: temp.getCategory().getIcon(),
        data: {
          data: temp
        }
      });
    }

    temp.setDateDeb(temp2);
  }

  cancelAll() {

    this.localNotifications.cancelAll();

    const alert = this.alertCtrl.create({
      title: 'Notifications cancelled',
      buttons: ['Ok']
    });

    alert.present();

  }

}
