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
  Category
} from '../../Tasker/Category';

import {
  Moment
} from 'moment';

import * as moment from 'moment';

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
  private myCat: any = '';
  private myCats: any = Tasker.getListCategories();

  constructor(public navCtrl: NavController, public navParams: NavParams, private toastCtrl: ToastController) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddTaskPage');
  }

  cancel() {
    this.navCtrl.pop();
  }

  save() {
    let newTask: Task;
    let success = false;
    const myPreventBeforeInt: number = parseInt(this.myPreventBefore.substring(this.myPreventBefore.indexOf(':') + 1), 10);
    const myHoursInt: number = parseInt(this.myHours.substring(0, this.myHours.indexOf(':')), 10);
    const myMinutesInt: number = parseInt(this.myHours.substring(this.myHours.indexOf(':') + 1), 10);
    const myDateMoment: Moment = moment(this.myDate, 'YYYY-MM-DD');
    const myRepetes = [this.monday, this.tuesday, this.wednesday, this.thursday, this.friday, this.saturday, this.sunday];

    console.log('mycat', this.myCat);

    if (this.myTitle !== '') {
      if (this.myDescription !== '') {
        if (this.myCats !== '') {
          if (this.isChecked) {
            let isRealyChecked = false;
            for (const i of myRepetes) {
              isRealyChecked = isRealyChecked || i;
            }
            if (isRealyChecked) {
              newTask = new Task(this.myTitle, this.myDescription, new Category('', 0, 2),
                null, myPreventBeforeInt, myHoursInt, myMinutesInt, myRepetes
              );
              success = true;
            } else {
              const toast = this.toastCtrl.create({
                message: 'Selectionné une répétition.',
                duration: 3000
              });
              toast.onDidDismiss(this.dismissHandler);
              toast.present();
            }
          } else {
            if (myDateMoment.isAfter(moment())) {
              newTask = new Task(this.myTitle, this.myDescription, new Category('', 0, 2),
                myDateMoment, myPreventBeforeInt, myHoursInt, myMinutesInt
              );
              success = true;
            } else {
              const toast = this.toastCtrl.create({
                message: 'Selectionné une date ultérieur à aujourd\'hui.',
                duration: 3000
              });
              toast.onDidDismiss(this.dismissHandler);
              toast.present();
            }
          }
        } else {
          const toast = this.toastCtrl.create({
            message: 'Selectionné une catégory.',
            duration: 3000
          });
          toast.onDidDismiss(this.dismissHandler);
          toast.present();
        }
      } else {
        const toast = this.toastCtrl.create({
          message: 'Saisir une description.',
          duration: 3000
        });
        toast.onDidDismiss(this.dismissHandler);
        toast.present();
      }
    } else {
      const toast = this.toastCtrl.create({
        message: 'Saisir un titre.',
        duration: 3000
      });
      toast.onDidDismiss(this.dismissHandler);
      toast.present();
    }

    if (success) {
      Tasker.getListTasks().push(newTask);
      Tasker.serializeLists();
      Tasker.sort();
      this.navCtrl.pop();
    }

  }

  private dismissHandler() {
    console.log('Toast onDidDismiss()');
  }

}
