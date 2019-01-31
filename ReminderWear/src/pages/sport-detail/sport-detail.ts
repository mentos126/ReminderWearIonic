import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {ISubscription} from 'rxjs/Subscription';
import {TaskerServiceProvider} from '../../providers/tasker-service/tasker-service';
import {SportTask} from '../../Tasker/SportTask';

import {Coordinate} from '../../Tasker/Coordinate';
import {Tasker} from '../../Tasker/Tasker';
import {SQLitePersistor} from '../../Tasker/SQLitePersistor';

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

  subscription: ISubscription;
  mySportTask: SportTask;
  myCoordinates: Coordinate[];

  steps: number;
  heart: number;
  distance: number;
  duration: number;
  durationMoment: string;

  public lineChartData: Array <any> = [{
    data: [],
    label: 'Elevation'
  }];
  public lineChartLabels: Array<any> = [''];
  public lineChartOptions: any = {
    responsive: true
  };
  public lineChartColors: Array < any > = [{
    backgroundColor: 'rgba(21,124,119,0.2)',
    borderColor: 'rgba(46,211,203,1)',
    pointBackgroundColor: 'rgba(46,211,203,1)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(46,211,203,0.8)'
  }];
  public lineChartLegend = true;
  public lineChartType = 'line';


  constructor(public navCtrl: NavController, public navParams: NavParams, private taskService: TaskerServiceProvider) {}

  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

  cancel(): void {
    this.navCtrl.pop();
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {

    this.subscription = this.taskService
      .currentSportTask
      .subscribe(res => {
        this.myCoordinates = res.getListCoord().slice();
        this.mySportTask = res;
        this.mySportTask.caculateDistance();
        this.steps = this.mySportTask.getSteps();
        this.heart = this.mySportTask.getHeart();
        this.distance = this.mySportTask.getDistance();
        this.durationMoment = this.mySportTask.getFormatedDuration();
      });

    this.initMap();
    this.initGraph();
  }

  initGraph(): any {
    const labels: string[] = [];
    const data: number[] = [];
    for (const coord of this.myCoordinates) {
      labels.push('');
      const height = coord.getHeight();
      if ( height > 0 ) {
        data.push(coord.getHeight());
      }
    }

    this.lineChartData = [{
      data: data,
      label: 'Elevation'
    }];
    this.lineChartLabels = labels;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ionViewDidLoad() {
    console.log(this.steps, this.distance, this.durationMoment);
  }
  initMap(): void {

    const coords = [];
    for (const c of this.myCoordinates) {
      coords.push(new google.maps.LatLng(c.getLat(), c.getLng()));
    }
    const polyline: google.maps.Polyline = new google.maps.Polyline({
      path: coords,
      geodesic: true,
      strokeColor: '#40ccdf',
      strokeOpacity: 1.0,
      strokeWeight: 2
    });

    let minLat = 200;
    let maxLat = -200;
    let minLng = 200;
    let maxLng = -200;
    for (const x of this.myCoordinates) {
      minLat = Math.min(minLat, x.getLat());
      maxLat = Math.max(maxLat, x.getLat());
      minLng = Math.min(minLng, x.getLng());
      maxLng = Math.max(maxLng, x.getLng());
    }

    const bounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(minLat, minLng),
      new google.maps.LatLng(maxLat, maxLng)
    );

    this.map = new google.maps.Map(this.mapElement.nativeElement);
    this.map.fitBounds(bounds);
    polyline.setMap(this.map);

  }

  delete() {
    Tasker.removeSportTaskByID(this.mySportTask.getID());
    SQLitePersistor.saveToDB().then(() => {
      this.navCtrl.pop();
    });
  }
}
