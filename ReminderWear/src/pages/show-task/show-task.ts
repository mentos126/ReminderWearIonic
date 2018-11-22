import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Tasker } from '../../Tasker/Tasker';
import {Moment} from 'moment';
import { Coordinate } from '../../Tasker/Coordinate';
import * as moment from 'moment';
import { SportActivityPage } from '../sport-activity/sport-activity';

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
    if (this.task.localisation !== null) {
      this.myLocalisation = new Coordinate(this.task.localisation.lat, this.task.localisation.lng, this.task.localisation.h);
    }
    this.myDate = moment(this.task.dateDeb, 'YYYY-MM-DD');
  }

  SPORT: string = Tasker.CATEGORY_SPORT_TAG;
  task: any = 'test';
  myDate: Moment = null;
  myLocalisation: Coordinate = null;

  ionViewDidLoad() { }

  cancel() {
    this.navCtrl.pop();
  }

  lunchSportActivity() {
    this.navCtrl.push(SportActivityPage);
  }

}
