import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Tasker } from '../../Tasker/Tasker';
import {Moment} from 'moment';
// import * as moment from 'moment';

/**
 * Generated class for the ShowTaskPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-show-task',
  templateUrl: 'show-task.html',
})
export class ShowTaskPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.task = navParams.data;
  }

  SPORT: string = Tasker.CATEGORY_SPORT_TAG;
  task: any = 'test';
  date: Moment = null;

  ionViewDidLoad() { }

  cancel() {
    this.navCtrl.pop();
  }

  lunchSportActivity() {
      // TODO lunch SPORT ACTIVITY
  }

}
