import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild
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
import {} from '@types/googlemaps';

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

  @ViewChild('map') mapElement;
  map: any;

  private subscription: ISubscription;
  private mySportTask: SportTask;

  private steps: number;
  private heart: number;
  private distance: number;
  private duration: number;
  private durationMoment: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private taskService: TaskerServiceProvider) {}

  ngOnInit(): void {

    this.initMap();

    this.subscription = this.taskService
      .currentSportTask
      .subscribe(res => {
        this.mySportTask = res;
        this.mySportTask.caculateDistance();
        this.steps = this.mySportTask.getSteps();
        this.heart = this.mySportTask.getHeart();
        this.distance = this.mySportTask.getDistance();
        this.duration = this.mySportTask.getDuration();
        const s = Math.floor(this.duration % 60);
        const m = Math.floor((this.duration / 60) % 60);
        const h = Math.floor((this.duration / (60 * 60)) % 24);
        this.durationMoment = +h + ' heures ' + m + ' minutes ' + s + ' secondes';
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ionViewDidLoad() {
    console.log(this.steps, this.heart, this.distance, this.durationMoment);
  }
  initMap(): void {
    const coords = new google.maps.LatLng(45, 100);
    const mapOptions: google.maps.MapOptions = {
      center: coords,
      zoom: 8,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    const marker: google.maps.Marker = new google.maps.Marker({
      map: this.map,
      position: coords
    });

    console.log(marker);
  }


}