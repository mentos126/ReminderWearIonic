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
  Task
} from '../../Tasker/Task';

import {
  Tasker
} from '../../Tasker/Tasker';

import {
  Moment
} from 'moment';

import * as moment from 'moment';
import { AddCategoryPage } from '../add-category/add-category';
import { EditCategoryPage } from '../edit-category/edit-category';

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
export class EditTaskPage {

  private recevTask: Task;

  private myTitle: string;
  private myDescription: string;
  private myCat: string;
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

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private toastCtrl: ToastController, private taskService: TaskerServiceProvider) {}

  ionViewDidLoad() {
    console.log(this.myCats);

    this.taskService
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
          console.log('myDate', this.myDate);
        } else {
          this.myDate = null;
        }
      });

    console.log('efsvqfdvsbsesfq', this.recevTask);

  }

  cancel() {
    this.navCtrl.pop();
  }

  delete() {
    Tasker.removeTaskByID(this.recevTask.getID());
    this.navCtrl.pop();
  }

  addCategory(): void {
    this.navCtrl.push(AddCategoryPage);
  }

  editCategory(): void {
    this.taskService.changeCategory(this.recevTask.getCategory());
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

  private dismissHandler() {
    console.log('Toast onDidDismiss()');
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

    if (this.myCat === '' || this.myCat === this.sport || this.myCat === this.nothing) {
      this.myCat = '';
    }

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
              this.lunchToast('Selectionné une répétition.');
            }
          } else {
            if (myDateMoment.isAfter(moment())) {
              newTask = new Task(this.myTitle, this.myDescription, finalyCat,
                myDateMoment, myPreventBeforeInt, myHoursInt, myMinutesInt
              );
              success = true;
            } else {
              this.lunchToast('Selectionné une date ultérieur à aujourd\'hui.');
            }
          }
        } else {
          this.lunchToast('Selectionné une catégory.');
        }
      } else {
        this.lunchToast('Saisir une description.');
      }
    } else {
      this.lunchToast('Saisir un titre.');
    }

    if (success) {
      // TODO modify task
      // Tasker.getListTasks().push(newTask);
      console.log(newTask);
      Tasker.serializeLists();
      Tasker.sort();
      this.navCtrl.pop();
    }

  }

}
