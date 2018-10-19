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
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  // CameraPosition,
  // MarkerOptions,
  Marker,
  Environment
} from '@ionic-native/google-maps';

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

  private map: GoogleMap;

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
    this.loadMap();
    console.log(this.steps, this.heart, this.distance, this.durationMoment);
  }

  loadMap() {

    // This code is necessary for browser
    Environment.setEnv({
      'API_KEY_FOR_BROWSER_RELEASE': 'AIzaSyAy4_amm__DjUVzEpIo2lnlnM4cIlUeajU',
      'API_KEY_FOR_BROWSER_DEBUG': 'AIzaSyAy4_amm__DjUVzEpIo2lnlnM4cIlUeajU'
    });

    const mapOptions: GoogleMapOptions = {
      camera: {
         target: {
           lat: 43.0741904,
           lng: -89.3809802
         },
         zoom: 18,
         tilt: 30
       }
    };

    // ionic cordova plugin add cordova-plugin-googlemaps --variable API_KEY_FOR_ANDROID="(AIzaSyAy4_amm__DjUVzEpIo2lnlnM4cIlUeajU)"
    // --variable API_KEY_FOR_IOS="(AIzaSyAy4_amm__DjUVzEpIo2lnlnM4cIlUeajU)"

    this.map = GoogleMaps.create('map_canvas', mapOptions);

    const marker: Marker = this.map.addMarkerSync({
      title: 'Ionic',
      icon: 'blue',
      animation: 'DROP',
      position: {
        lat: 43.0741904,
        lng: -89.3809802
      }
    });
    marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
      alert('clicked');
    });
  }

}
