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


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit, OnDestroy {

  private subscription: ISubscription;
  searchQuery = '';
  items: Task[];
  orderBy = false;
  myCoordinate: Coordinate = null;

  constructor(public navCtrl: NavController,
    private taskService: TaskerServiceProvider,
    public modalCtrl: ModalController,
    public sanitizer: DomSanitizer,
    private camera: Camera) {
    this.initializeItems();
    this.sort();
  }

  ngOnInit(): void {
    this.subscription = this.taskService
      .currentTask
      .subscribe();
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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
    const tache: Task = new Task('tache 1', 'description', c, moment(), 30, 12, 30);
    // tslint:disable-next-line:max-line-length
    tache.setPhoto('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ymrRtsbOOn0B661epf+kAysT+rfI9pys3NKeilccQuWwFgpjgL2wWc7bYYMME+R1zX/CDkXOjcSKBOtJ12q0Vv9PY9m2QY5s26Wgb2DlV08pMfAONtus0B3K6xCqCisJ20wu7q5YD/hRrDxPrY3igPk7sGM9CyKxIsF8crd6Ax+RVRin9/Wd/vNWrJj4db3exlL+00XEhVhFRMF5/Y+SO9+Z0SsnwgxSImaUXqOBrbAawf6sfAawgKXXnxCpHgRmUKGFuZFg4ZAtg3UW3gmbN7yzlHx97AhHZ7TIms3H9trex0q1lum1VK/lskh9RGb3Zz99/gayWLWOy+piKTATeEnW9BHgNbmF0VpFggVr2UZgfUB2U1Jhc1mUutUQoRRIiDsXywI+JTd1sixXayRVJFgaCddXlma4kiOj5MJtLCvUTxaoWuTLOj8LSqK0Oz+bZYEWYJm+t7E9uuly+WaLZC2RUJFglUq6rKzZQLl8NSJZb8Vxyc92x3VcrlezXouwrYLW7kqeRERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERESkAZlDLmsm09KxGbCH/vTYvKU1UwbUtXLPD3tFCUV8KA65aDmFAlUZMjtkbLjgfOARCszNZDP8/cTaipVNNtPScQBwG/AHexVuW69P8x7VVR0c0rg8ak/EB6LhwhVUt9aRJTM+Y3OefwvcAFxNho0LhY6Klk8WOAsbbZrVa1tgAlCbifP5Ij7UByrQlluxCXAyNrUzg03mPAg4ulDI8JmL8hVNsI+s4u+jsfnBERFrgg2xGdSdsWWWQq6jUNkWbMoq/j4Tm3IfEbEmmKNXZ7ydzWXbKp1gv8AGZv9XKMClBViepRBVJ+IDUSBDO5mpwGXYfGj7MzwGXNPeXuDOkyp3TnSuI8vt2Q6mAvtJMP/KdBReymQy3H5SfdSgiA/EHRNqabgo30GBK4BJwK7A+8B97YXC9OpsjOMjIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiJ8QKxjiagoNDSufHRm4oS6yiGYc/M5YCAwCFgfWA+oBxJp5IFlwDxgLnaCdhHQVg6hdfP9Z4A+wGBgKDAc6Ofc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');
    t.addTask(tache);
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
    // TODO END

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
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
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
      }
    });
    myModal.present();
    const t: Task = Tasker.getTaskByID(id);
    console.log(this.myCoordinate);
    t.setLocalisation(this.myCoordinate );
  }

}
