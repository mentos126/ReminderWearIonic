import {Component, OnDestroy, OnInit} from '@angular/core';
import {AlertController, ModalController, NavController, Platform} from 'ionic-angular';
import {AddTaskPage} from '../add-task/add-task';
import {Tasker} from '../../Tasker/Tasker';
import {Task} from '../../Tasker/Task';
import * as moment from 'moment';
import {EditTaskPage} from '../edit-task/edit-task';
import {TaskerServiceProvider} from '../../providers/tasker-service/tasker-service';
import {ISubscription} from 'rxjs/Subscription';
import {Camera, CameraOptions} from '@ionic-native/camera';
import {Coordinate} from '../../Tasker/Coordinate';
import {ModalMapPage} from '../modal-map/modal-map';
import {ILocalNotification, LocalNotifications} from '@ionic-native/local-notifications';
import {ShowTaskPage} from '../show-task/show-task';
import {SQLitePersistor} from '../../Tasker/SQLitePersistor';

/*import {
  SportActivityPage
} from '../sport-activity/sport-activity';*/

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
  idInterval: number;

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
        this.sort(false);
      }
    });

    this.plt.ready().then(() => {
      try {
        this.localNotifications
          .on('click')
          .subscribe((res) => {
            const data = res.data.data;
            this.lunchLocalNotification();
            this.navCtrl.push(ShowTaskPage, data);
          });
      } catch (e) {
        console.log(e);
      }
    });
  }

  ngOnInit(): void {
    this.subscriptionTask = this.taskService
      .currentTask
      .subscribe();
  }

  ngOnDestroy(): void {
    this.subscriptionTask.unsubscribe();
    clearInterval(this.idInterval);
  }

  ionViewDidLoad() {}

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
    Tasker.unserializeLists();

    this.items = Tasker.getListTasks();
    this.getItems({
      'target': {
        'value': this.val
      }
    });
    this.idInterval = setInterval(() => {
      this.getItems({
        'target': {
          'value': this.val
        }
      });
      this.sort(false);
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
    Tasker.serializeLists();
    console.log('side-delete :: ', item);
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

  sort(ex: boolean): void {
    if (this.items !== undefined && this.items.length > 0) {
      if (ex) {
        this.orderBy = !this.orderBy;
      }
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
      this.oldItems.sort((n1, n2) => {
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
      SQLitePersistor.saveToDB();
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
      SQLitePersistor.saveToDB();
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
        SQLitePersistor.saveToDB();
      }
    });
    myModal.present();
  }

  lunchLocalNotification() {

    const now: number = moment().valueOf();

    const tasksToTrigger: Task[] = [];
    const tasksToTriggerIds: number[] = [];

    for (const task of Tasker.getListTasks()) {
      if (task.getIsActivatedNotification() && task.getNextDate().valueOf() >= now) {
        tasksToTrigger.push(task);
        tasksToTriggerIds.push(task.getID());
      }
    }

    this.localNotifications.getScheduledIds().then(scheduledIds => {

      // console.log('cuurently scheduled IDs are ', scheduledIds);
      // console.log('tasks IDs to schedule are ', tasksToTriggerIds);

      for ( const task of tasksToTrigger ) {

        const notification: ILocalNotification = {
          id: task.getID(),
          title: task.getName(),
          text: task.getDescription(),
          trigger: {
            at: new Date(task.getNextDate().valueOf())
          },
          led: 'FF0000',
          icon: task.getCategory().getIcon(),
          data: {
            data: task
          }
        };

        if ( scheduledIds.indexOf( task.getID() ) >= 0 ) { // si la tâche est déjà planifiée
          this.localNotifications.update(notification);  //  mettre à jour sa notif. au cas où
          //  console.log('update notificaation ', notification);
        } else { // la tâche n'est pas encore planifiée, créer sa notification
          this.localNotifications.schedule(notification);
            // console.log('add notificaation ', notification);
        }
      }

      // ID planifié mais pas de tâche existante associée (tâche supprimée ?) => annuler la notif
      for (const scheduledId of scheduledIds) {
        if (tasksToTriggerIds.indexOf(scheduledId) === -1 ) {
          this.localNotifications.cancel( scheduledId);
          // console.log('cancelling notification for a deleted task whith ID=' + scheduledId)
        }
      }

    });
  }

  cancelAll() {

    this.localNotifications.cancelAll().then(() => {
      const alert = this.alertCtrl.create({
        title: 'Notifications annulées',
        buttons: ['Ok']
      });

      alert.present();
    });

  }

}
