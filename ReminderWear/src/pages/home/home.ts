import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';
import {
  NavController,
  ModalController,
  Platform
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

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit, OnDestroy {

  private subscriptionTask: ISubscription;
  searchQuery = '';
  items: Task[];
  orderBy = false;
  myCoordinate: Coordinate = null;

  debug = 'NOPE';

  constructor(public navCtrl: NavController,
    private taskService: TaskerServiceProvider,
    public modalCtrl: ModalController,
    private camera: Camera,
    private localNotifications: LocalNotifications,
    private plt: Platform) {
    this.initializeItems();
    this.sort();

    this.plt.ready().then(() => {
      console.log('READY');
      this.debug = 'READY';
      this.localNotifications
        .on('click')
        .subscribe((data) => {

          this.debug = data;
          console.log(data);

          // const json = JSON.parse(notification.data);
          // console.log('recevNotif', json, notification);
          // console.log('state', state);

        });
    });
  }

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
    const c2 = new Category('category 2', 'ios-alarm', '#f5f5f5');
    t.addCategory(c);
    t.addCategory(c2);
    t.addTask(new Task('tache 1', 'description', c, moment(), 0, moment().hours(), moment().minutes() + 1));
    let i = 0;
    while (i < 10000000) {
      i++;
    }
    t.addTask(new Task('tache 2', 'description', c, null, 0, moment().hours(), moment().minutes() + 2,
      [true, false, false, true, false, true, false]));
    i = 0;
    while (i < 10000000) {
      i++;
    }
    t.addTask(new Task('tache 3', 'description', c2, moment(), 0, moment().hours(), moment().minutes() + 3));
    i = 0;
    while (i < 10000000) {
      i++;
    }
    t.addTask(new Task('tache 4', 'description', c, moment(), 0, moment().hours(), moment().minutes() + 4));
    // TODO END REMOVE

    this.items = Tasker.getListTasks();

  }

  getItems(ev: any) {
    this.items = Tasker.getListTasks();
    const val = ev.target.value;
    if (val && val.trim() !== '') {
      this.items = this.items.filter((item) => {
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
      if (t === null || t.getNextDate().valueOf() < temp.getNextDate().valueOf()) {
        temp = t;
      }
    }

    this.localNotifications.schedule({
      id: temp.getID(),
      text: temp.getName(),
      trigger: {
        at: new Date(temp.getNextDate().valueOf()) //  t.getNextDate().valueOf()
      },
      led: 'FF0000',
      icon: temp.getCategory().getIcon(),
      data: {
        data : temp,
        id: temp.getID(),
        type: temp.getCategory().getName()
      }
    });


    console.log('notif lunched');

    //   this.localNotifications.schedule([{
    //     id: 1, // id de la tache
    //     text: 'titre de la tache',
    //     trigger: {
    //       at: new Date(new Date().getTime() + 60) // date de la tache
    //     },
    //     led: 'FF0000',
    //     icon: 'http://example.com/icon.png', // icone de la tache
    //     data: {}
    //   },
    //   {
    //     id: 2, // id de la tache
    //     text: 'titre de la tache 2',
    //     trigger: {
    //       at: new Date(new Date().getTime() + 300) // date de la tache
    //     },
    //     led: 'FF0000',
    //     icon: 'http://example.com/icon.png', // icone de la tache
    //     sound: 'file://sound.mp3',
    //     data: {}
    //   }
    // ]);

    // this.localNotifications.schedule({
    //   id: 2, // id de la tache
    //   text: 'titre de la tache 2',
    //   // trigger: {
    //     at: new Date(new Date().getTime() + 300), // date de la tache
    //   // },
    //   led: 'FF0000',
    //   icon: 'http://example.com/icon.png', // icone de la tache
    //   sound: 'file://sound.mp3',
    //   data: {}
    // });

    // // Schedule multiple notifications
    // this.localNotifications.schedule([{
    //   id: 1,
    //   text: 'Multi ILocalNotification 1',
    //   // sound: isAndroid ? 'file://sound.mp3' : 'file://beep.caf',
    //   data: {
    //     // secret: key
    //   }
    // }, {
    //   id: 2,
    //   title: 'Local ILocalNotification Example',
    //   text: 'Multi ILocalNotification 2',
    //   icon: 'http://example.com/icon.png'
    // }]);

  }

}
