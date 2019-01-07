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

import {TaskerServiceProvider} from '../../providers/tasker-service/tasker-service';
import {Task} from '../../Tasker/Task';
import {Tasker} from '../../Tasker/Tasker';
import {Moment} from 'moment';
import * as moment from 'moment';
import {AddCategoryPage} from '../add-category/add-category';
import { EditCategoryPage } from '../edit-category/edit-category';
import { ISubscription } from 'rxjs/Subscription';
import { ModalCategoryPage } from '../modal-category/modal-category';
import { Category } from '../../Tasker/Category';
import {SQLitePersistor} from '../../Tasker/SQLitePersistor';

/**
 * Generated class for the EditTaskPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-task',
  templateUrl: 'edit-task.html',
})
export class EditTaskPage implements OnInit, OnDestroy {

  private recevTask: Task;
  private subscribe: ISubscription;

  private myTitle: string;
  private myDescription: string;
  private myCat: string;
  private myCategory: Category;
  private myPreventBefore = '10:00';
  private isChecked: boolean;
  private monday: boolean;
  private tuesday: boolean;
  private wednesday: boolean;
  private thursday: boolean;
  private friday: boolean;
  private saturday: boolean;
  private sunday: boolean;
  private myHours: string = moment().format('HH:mm');
  private myDate: string = moment().format('YYYY-MM-DD');
  private myCats: any = Tasker.getListCategories();

  private sport = Tasker.CATEGORY_SPORT_TAG;
  private nothing = Tasker.CATEGORY_NONE_TAG;

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController,
    private toastCtrl: ToastController, private taskService: TaskerServiceProvider) {}

  ngOnInit(): void {
   this.subscribe = this.taskService
      .currentTask
      .subscribe(res => {
        this.recevTask = res;
        this.myTitle = this.recevTask.getName();
        this.myDescription = this.recevTask.getDescription();
        const h = moment();
        h.hours(this.recevTask.getTimeHour());
        h.minutes(this.recevTask.getTimeMinutes());
        this.myHours = h.format('HH:mm');
        this.myCat = this.recevTask.getCategory().getName();
        this.myCategory = this.recevTask.getCategory();
        this.myPreventBefore = '10:' + String(this.recevTask.getWarningBefore());
        this.isChecked = this.recevTask.getDateDeb() === null;
        this.monday = this.recevTask.getRepete()[0];
        this.tuesday = this.recevTask.getRepete()[1];
        this.wednesday = this.recevTask.getRepete()[2];
        this.thursday = this.recevTask.getRepete()[3];
        this.friday = this.recevTask.getRepete()[4];
        this.saturday = this.recevTask.getRepete()[5];
        this.sunday = this.recevTask.getRepete()[6];
        if (this.recevTask.getDateDeb() !== null) {
          this.myDate = this.recevTask.getDateDeb().format('YYYY-MM-DD');
        } else {
          this.myDate = null;
        }
      });
  }
  ngOnDestroy(): void {
    this.subscribe.unsubscribe();
  }

  ionViewDidLoad() {
    console.log(this.myCats, this.myCategory, this.sport, this.nothing);
  }

  cancel() {
    this.navCtrl.pop();
  }

  delete() {
    Tasker.removeTaskByID(this.recevTask.getID());
    SQLitePersistor.saveToDB();
    this.navCtrl.pop();
  }

  addCategory(): void {
    this.navCtrl.push(AddCategoryPage);
  }

  editCategory(): void {
    this.taskService.changeCategory(Tasker.getCategoryByName(this.myCat));
    this.navCtrl.push(EditCategoryPage);
  }

  lunchToast(message: string): void {
    const toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.onDidDismiss(this.dismissHandler);
    toast.present();
  }

  private dismissHandler() { }

  openCategories() {
    const myModal = this.modalCtrl.create(ModalCategoryPage, { 'myParam': this.myCats }, {cssClass: 'select-modal' });
    myModal.onDidDismiss(data => {
      if (data) {
        this.myCategory = data;
        this.myCat = data.getName();
      }
    });
    myModal.present();
  }


  save() {
    let newTask: Task;
    let success = false;
    const myPreventBeforeInt: number = parseInt(this.myPreventBefore.substring(this.myPreventBefore.indexOf(':') + 1), 10);
    const myHoursInt: number = parseInt(this.myHours.substring(0, this.myHours.indexOf(':')), 10);
    const myMinutesInt: number = parseInt(this.myHours.substring(this.myHours.indexOf(':') + 1), 10);
    const myDateMoment: Moment = moment(this.myDate, 'YYYY-MM-DD');
    myDateMoment.minutes(myMinutesInt);
    myDateMoment.hours(myHoursInt);
    const myRepetes = [this.monday, this.tuesday, this.wednesday, this.thursday, this.friday, this.saturday, this.sunday];

    if (this.myTitle !== '') {
      if (this.myDescription !== '') {
        if (this.myCat !== '') {
          const finalyCat = Tasker.getCategoryByName(this.myCat);
          if (this.isChecked) {
            let isRealyChecked = false;
            for (const i of myRepetes) {
              isRealyChecked = isRealyChecked || i;
            }
            if (isRealyChecked) {
              newTask = new Task(this.myTitle, this.myDescription, finalyCat,
                null, myPreventBeforeInt, myHoursInt, myMinutesInt, myRepetes
              );
              success = true;
            } else {
              this.lunchToast('Selectionnez une répétition.');
            }
          } else {
            if (myDateMoment.isAfter(moment())) {
              newTask = new Task(this.myTitle, this.myDescription, finalyCat,
                myDateMoment, myPreventBeforeInt, myHoursInt, myMinutesInt
              );
              success = true;
            } else {
              this.lunchToast('Selectionnez une date ultérieure à aujourd\'hui');
            }
          }
        } else {
          this.lunchToast('Selectionnez une catégorie');
        }
      } else {
        this.lunchToast('Saisissez une description');
      }
    } else {
      this.lunchToast('Saisissez un titre');
    }

    if (success) {
      console.log('editTask :: save' );
      Tasker.getInstance().editTaskById(this.recevTask.getID(), newTask);
      Tasker.serializeLists();
      Tasker.sort();
      this.navCtrl.pop();
    }

  }

}
