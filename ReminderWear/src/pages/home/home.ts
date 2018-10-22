import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';
import {
  NavController, ModalController
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
  DomSanitizer
} from '@angular/platform-browser';
import {
  Camera,
  CameraOptions
} from '@ionic-native/camera';
import {
  Coordinate
} from '../../Tasker/Coordinate';
import { ModalMapPage } from '../modal-map/modal-map';
import { MapServiceProvider } from '../../providers/map-service/map-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit, OnDestroy {

  private subscriptionTask: ISubscription;
  private subscriptionMap: ISubscription;
  searchQuery = '';
  items: Task[];
  orderBy = false;
  myCoordinate: Coordinate = null;

  constructor(public navCtrl: NavController,
    private taskService: TaskerServiceProvider,
    public modalCtrl: ModalController,
    public sanitizer: DomSanitizer,
    private mapService: MapServiceProvider,
    private camera: Camera) {
    this.initializeItems();
    this.sort();
  }

  ngOnInit(): void {
    this.subscriptionTask = this.taskService
      .currentTask
      .subscribe();

    this.subscriptionMap = this.mapService
      .currentCoordinate
      .subscribe();
  }

  ngOnDestroy(): void {
    this.subscriptionTask.unsubscribe();
    this.subscriptionMap.unsubscribe();
  }

  ionViewDidLoad() {
    console.log(this.sanitizer);
  }

  initializeItems() {
    const t = new Tasker();
    Tasker.unserializeLists();

    // TODO REMOVE FROM
    Tasker.getListTasks();
    const c = new Category('Aucune', 'ios-add-circle', '#abcdef');
    const c2 = new Category('category 2', 'ios-alarm', '#f5f5f5');
    t.addCategory(c);
    t.addCategory(c2);
    t.addTask(new Task('tache 1', 'description', c, moment(), 30, 12, 30));
    let i = 0;
    while (i < 10000000) {
      i++;
    }
    t.addTask(new Task('tache 2', 'description', c, null, 30, 12, 30, [true, false, false, true, false, true, false]));
    i = 0;
    while (i < 10000000) {
      i++;
    }
    t.addTask(new Task('tache 3', 'description', c2, moment(), 30, 12, 30));
    i = 0;
    while (i < 10000000) {
      i++;
    }
    t.addTask(new Task('tache 4', 'description', c, moment(), 30, 12, 30));
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

  takePhoto(event: any, id: number) {
    event.preventDefault();

    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(options).then((imageData) => {
      const base64Image = imageData;
      const t: Task = Tasker.getTaskByID(id);
      t.setPhoto(base64Image);
    }, (err) => {
      console.log(err);
    });

  }

  selectLocalisation(event: any, id: number) {
    event.preventDefault();

    this.myCoordinate = null;
    const myModal = this.modalCtrl.create(ModalMapPage, {cssClass: 'select-modal' });
    myModal.onDidDismiss(data => {
      if (data) {
        this.myCoordinate = data;
        const t: Task = Tasker.getTaskByID(id);
        t.setLocalisation(this.myCoordinate );
      }
    });
    myModal.present();
  }

}
