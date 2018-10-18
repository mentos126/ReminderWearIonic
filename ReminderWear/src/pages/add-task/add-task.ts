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
 * Generated class for the AddTaskPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-task',
  templateUrl: 'add-task.html',
})
export class AddTaskPage {

  private isChecked = false;
  private monday = false;
  private tuesday = false;
  private wednesday = false;
  private thursday = false;
  private friday = false;
  private saturday = false;
  private sunday = false;
  private myTitle = '';
  private myDescription = '';
  private myHours = moment().add(5, 'minutes').format('HH:mm');
  private myPreventBefore = '10:30';
  private myDate = moment().add(5, 'minutes').format('YYYY-MM-DD');
  private myCat = Tasker.CATEGORY_NONE_TAG;
  private sport = Tasker.CATEGORY_SPORT_TAG;
  private nothing = Tasker.CATEGORY_NONE_TAG;
  private myCats: any = Tasker.getListCategories();

  constructor(public navCtrl: NavController, public navParams: NavParams, private toastCtrl: ToastController) { }

  ionViewDidLoad() {
    console.log(this.myCats);
  }

  cancel() {
    this.navCtrl.pop();
  }

  addCategory(): void {
    this.navCtrl.push(AddCategoryPage);
  }

  editCategory(): void {
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
      Tasker.getListTasks().push(newTask);
      Tasker.serializeLists();
      Tasker.sort();
      this.navCtrl.pop();
    }

  }

}
