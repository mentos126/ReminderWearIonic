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
import {
  ShowTaskPage
} from '../show-task/show-task';
import {
  SportActivityPage
} from '../sport-activity/sport-activity';
import {SQLitePersistor} from '../../Tasker/SQLitePersistor';


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
  val = '';
  sizeOldItem = 0;

  debug: any = 'null';

  constructor(public navCtrl: NavController,
              private taskService: TaskerServiceProvider,
              public modalCtrl: ModalController,
              private camera: Camera,
              private localNotifications: LocalNotifications,
              private plt: Platform,
              private alertCtrl: AlertController,
  ) {


    SQLitePersistor.databaseReady.subscribe((ready) => {
      if (ready) {
        this.initializeItems();
        this.sort();
      }});




    this.plt.ready().then(() => {
      // console.log('READY');
      try {
        this.localNotifications
          .on('click')
          .subscribe((res) => {
            const data = res.data.data;
            this.navCtrl.push(ShowTaskPage, data);
          });
      } catch (e) {
        console.log(e);
      }
    });
  }

  lunchLocalNotification() {
    let temp: Task[] = null;
    const now: number = moment().valueOf();
    for (const t of Tasker.getListTasks()) {
      if (t.getIsActivatedNotification() && t.getNextDate().valueOf() >= now) {
        if (temp === null || t.getNextDate().valueOf() < temp[0].getNextDate().valueOf()) {
          temp = [];
          temp.push(t);
        } else if (t.getNextDate().valueOf() === temp[0].getNextDate().valueOf()) {
          temp.push(t);
        }
      }
    }

    if (temp !== null) {
      const temp2: any = temp[0].getDateDeb();
      for (const t of temp) {
        t.setDateDeb(t.getNextDate());
      }

      const toSchedule: any[] = [];
      for (const t of temp) {
        toSchedule.push({
          id: t.getID(),
          title: t.getName(),
          text: t.getDescription(),
          trigger: {
            at: new Date(t.getNextDate().valueOf())
          },
          led: 'FF0000',
          icon: t.getCategory().getIcon(),
          data: {
            data: t
          }
        });
      }

      this.debug = toSchedule;

      this.localNotifications.schedule(toSchedule);

      for (const t of temp) {
        t.setDateDeb(temp2);
      }
    }
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

  ionViewDidLoad() {
    // console.log('home loaded');
  }

  // ionViewDidEnter() {
  //   // console.log('home entered');
  //   // SQLitePersistor.loadFromDB().then(() => {
  //   //   Tasker.getInstance();
  //   //   this.items = Tasker.getListTasks();
  //   //   console.log('items : ');
  //   //   console.log(this.items);
  //   // });
  //
  // }

  initializeItems() {

    console.log('home.ts initialize items');
    Tasker.unserializeLists();

    // // TODO REMOVE FROM
    // if (Tasker.getListTasks().length === 0 ){
    //   console.log('DEBUG : Ajout manuel de tâches');
    //   const t = new Tasker();
    //   Tasker.getListTasks();
    //   const c = Tasker.getCategoryByName(Tasker.CATEGORY_NONE_TAG);
    //   const c2 = Tasker.getCategoryByName(Tasker.CATEGORY_SPORT_TAG);
    //   // t.addCategory(c);
    //   // t.addCategory(c2);
    //   const time = moment();
    //   t.addTask(new Task('tache 1', 'description', c2, time, 0, time.hours(), (time.minutes() + 1) % 60));
    //   t.addTask(new Task('tache 1 bis', 'description', c2, time, 0, time.hours(), (time.minutes() + 1) % 60));
    //   let i = 0;
    //   while (i < 10000000) {
    //     i++;
    //   }
    //   t.addTask(new Task('tache 2', 'description', c, null, 0, moment().hours(), (moment().minutes() + 2) % 60,
    //     [false, true, false, false, false, false, false]));
    //   i = 0;
    //   while (i < 10000000) {
    //     i++;
    //   }
    //   t.addTask(new Task('tache 3', 'description', c2, moment(), 0, moment().hours(), (moment().minutes() + 3) % 60));
    //   i = 0;
    //   while (i < 10000000) {
    //     i++;
    //   }
    //   t.addTask(new Task('tache 4', 'description', c, moment(), 0, moment().hours(), (moment().minutes() + 4) % 60));
    //   Tasker.serializeLists();
    // } else {
    //   console.log(Tasker.getListTasks().length + ' tâches trouvees')
    // }
    // // TODO END REMOVE

    this.items = Tasker.getListTasks();
    console.log('Home : got ' + this.items.length + ' tasks to display');
    this.getItems({
      'target': {
        'value': this.val
      }
    });
    setInterval(() => {
      this.getItems({
        'target': {
          'value': this.val
        }
      });
      this.lunchLocalNotification();
    }, 1000);

  }

  getItems(ev: any) {
    const allItems = Tasker.getListTasks();
    this.items = [];
    this.oldItems = [];
    this.val = ev.target.value;
    const now = moment().valueOf();
    for (const item of allItems) {
      if (item.getName().toLowerCase().indexOf(this.val.toLowerCase()) > -1) {
        if (item.getNextDate().valueOf() < now) {
          this.oldItems.push(item);
        } else {
          this.items.push(item);
        }
      } else if (item.getDescription().toLowerCase().indexOf(this.val.toLowerCase()) > -1) {
        if (item.getNextDate().valueOf() < now) {
          this.oldItems.push(item);
        } else {
          this.items.push(item);
        }
      } else if (item.getCategory().getName().toLowerCase().indexOf(this.val.toLowerCase()) > -1) {
        if (item.getNextDate().valueOf() < now) {
          this.oldItems.push(item);
        } else {
          this.items.push(item);
        }
      } else if (item.getNextDate().format('DD MMM. YYYY').toLowerCase().indexOf(this.val.toLowerCase()) > -1) {
        if (item.getNextDate().valueOf() < now) {
          this.oldItems.push(item);
        } else {
          this.items.push(item);
        }
      }
    }
    this.sizeOldItem = this.oldItems.length;
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

  alertPhoto($event: any, id: number) {
    this.eventStopPropagation($event);

    const alert = this.alertCtrl.create({
      title: 'Choisir',
      message: 'Voulez vous prendre ou rechercher une photo',
      buttons: [{
          text: 'Appareil Photo',
          role: 'cancel',
          handler: () => {
            this.takePhoto($event, id);
          }
        },
        {
          text: 'Bibliothèque',
          handler: () => {
            this.selectPhoto($event, id);
          }
        }
      ]
    });
    alert.present();
  }

  takePhoto($event: any, id: number) {
    this.eventStopPropagation($event);

    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: true,
      allowEdit: true,
      targetHeight: 300,
      targetWidth: 300
    };

    this.camera.getPicture(options).then((imageData) => {
      const t: Task = Tasker.getTaskByID(id);
      t.setPhoto('data:image/jpeg;base64,' + imageData);
    }, (err) => {
      console.error(err);
    });

  }

  selectPhoto($event: any, id: number) {
    this.eventStopPropagation($event);

    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum: false,
      allowEdit: true,
      targetHeight: 300,
      targetWidth: 300
    };

    this.camera.getPicture(options).then((imageData) => {
      const t: Task = Tasker.getTaskByID(id);
      t.setPhoto('data:image/jpeg;base64,' + imageData);
    }, (err) => console.log(err));
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

  // public static lunchLocalNotification() {
  //   let temp: Task[] = null;
  //   const now: number = moment().valueOf();
  //   for (const t of Tasker.getListTasks()) {
  //     if (t.getIsActivatedNotification() && t.getNextDate().valueOf() >= now) {
  //       if (temp === null || t.getNextDate().valueOf() < temp[0].getNextDate().valueOf()) {
  //         temp = [];
  //         temp.push(t);
  //       } else if (t.getNextDate().valueOf() === temp[0].getNextDate().valueOf()) {
  //         temp.push(t);
  //       }
  //     }
  //   }

  //   if (temp !== null) {
  //     const temp2: any = temp[0].getDateDeb();
  //     for (const t of temp) {
  //       t.setDateDeb(t.getNextDate());
  //     }

  //     const toSchedule: any[] = [];
  //     for (const t of temp) {
  //       toSchedule.push({
  //         id: t.getID(),
  //         title: t.getName(),
  //         text: t.getDescription(),
  //         trigger: {
  //           at: new Date(t.getNextDate().valueOf())
  //         },
  //         led: 'FF0000',
  //         icon: t.getCategory().getIcon(),
  //         data: {
  //           data: t
  //         }
  //       });
  //     }

  //     this.debug = toSchedule;

  //     this.localNotifications.schedule(toSchedule);

  //     for (const t of temp) {
  //       t.setDateDeb(temp2);
  //     }
  //   }
  // }

  cancelAll() {

    this.localNotifications.cancelAll();

    const alert = this.alertCtrl.create({
      title: 'Notifications cancelled',
      buttons: ['Ok']
    });

    alert.present();

  }

}
