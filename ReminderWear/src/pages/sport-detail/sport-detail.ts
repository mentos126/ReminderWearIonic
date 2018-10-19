import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams
} from 'ionic-angular';
import {
  ISubscription
} from 'rxjs/Subscription';
import {
  TaskerServiceProvider
} from '../../providers/tasker-service/tasker-service';
import {
  SportTask
} from '../../Tasker/SportTask';
import { Moment } from 'moment';
import * as moment from 'moment';

/**
 * Generated class for the SportDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sport-detail',
  templateUrl: 'sport-detail.html',
})
export class SportDetailPage implements OnInit, OnDestroy {

  private subscription: ISubscription;
  private mySportTask: SportTask;

  private steps: number;
  private heart: number;
  private distance: number;
  private duration: number;
  private durationMoment: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private taskService: TaskerServiceProvider) {}

  ngOnInit(): void {

    this.subscription = this.taskService
      .currentSportTask
      .subscribe(res => {
        this.mySportTask = res;
        this.mySportTask.caculateDistance();
        this.steps = this.mySportTask.getSteps();
        this.heart = this.mySportTask.getHeart();
        this.distance = this.mySportTask.getDistance();
        this.duration = this.mySportTask.getDuration();
        const s = Math.floor( this.duration  % 60 );
        const m = Math.floor( (this.duration  / 60) % 60 );
        const h = Math.floor( (this.duration / ( 60 * 60)) % 24 );
        this.durationMoment =  + h + ' heures ' + m + ' minutes ' + s  + ' secondes';
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SportDetailPage');
  }

}
