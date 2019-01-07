import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {SportTask} from '../../Tasker/SportTask';
import {Coordinate} from '../../Tasker/Coordinate';
import * as moment from 'moment';
import {Geolocation} from '@ionic-native/geolocation';
import {Diagnostic} from '@ionic-native/diagnostic';
import {Health} from '@ionic-native/health';
import {IPedometerData, Pedometer} from '@ionic-native/pedometer';
import {Tasker} from '../../Tasker/Tasker';
import {SQLitePersistor} from '../../Tasker/SQLitePersistor';

/**
 * Generated class for the SportActivityPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sport-activity',
  templateUrl: 'sport-activity.html',
})
export class SportActivityPage {

  @ViewChild('map') mapElement;
  map: any;

  mySportTask: SportTask;
  myCoordinates: Coordinate[] = [];


  name = '';
  description = '';
  nameCategory = '';
  colorCategory = '';
  iconCategory = '';
  steps = 0;
  heart = 0;
  distance = 0;
  duration = moment().hours(0).minutes(0).seconds(0).format('HH : mm : ss');
  durationMoment = 0;
  timer = 0;

  debug1: any = 'null';

  isInResgiter = false;

  public lineChartData: Array < any > = [{
    data: [0],
    label: 'Elevation'
  }];
  public lineChartLabels: Array < any > = [''];
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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private geolocation: Geolocation,
    private diagnostic: Diagnostic,
    private pedometer: Pedometer,
    private health: Health
  ) {
    const task = navParams.data;
    this.name = task.name;
    this.description = task.descrtiption;
    this.nameCategory = task.nameCategory;
    this.colorCategory = task.colorCategory;
    this.iconCategory = task.iconCategory;
  }

  ionViewDidLoad() {
    this.initMap();
    this.initGraph();
  }

  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

  onDrag($event) {
    $event.stopPropagation();
  }

  cancel(): void {
    this.navCtrl.popAll();
  }

  public caculateDistance(): void {
    let res = 0;
    for (let i = 0; i < this.myCoordinates.length; i++) {
      if (i !== 0) {
        res += this.distanceBetweenTwoPoint(this.myCoordinates[i - 1], this.myCoordinates[i]);
      }
    }
    this.distance = Math.floor(res) / 1000;
  }

  public distanceBetweenTwoPoint(c1: Coordinate, c2: Coordinate): number {

    const R = 6371;

    const latDistance = (c2.getLat() - c1.getLat()) * Math.PI / 180;
    const lonDistance = (c2.getLng() - c1.getLng()) * Math.PI / 180;
    const a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2) +
      Math.cos((c1.getLat()) * Math.PI / 180) * Math.cos((c2.getLat() * Math.PI / 180)) *
      Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let distance = R * c * 1000;

    const height = 0; // c1.getHeight() - c2.getHeight();

    distance = Math.pow(distance, 2) + Math.pow(height, 2);

    return Math.sqrt(distance);
  }

  startRegister() {
    this.isInResgiter = true;
    this.durationMoment = moment().valueOf();
    setInterval(() => {
      if (this.isInResgiter) {
        const temp = moment();
        this.timer = temp.valueOf() - this.durationMoment;
        this.duration = '' + moment()
          .hours((temp.valueOf() - this.durationMoment) / 3600000 % 24)
          .minutes((temp.valueOf() - this.durationMoment) / 60000 % 60)
          .seconds((temp.valueOf() - this.durationMoment) / 1000 % 60)
          .format('HH : mm : ss');
      }
    }, 1000);

    // console.log('START runLocation');
    this.runLocation();
    // console.log('END   runLocation');

    this.diagnostic.isLocationAvailable()
      .then((state) => {
        console.log('is location available ? ' + state);
        if (!state) {
          this.diagnostic.switchToLocationSettings();
        }
      }).catch(e => console.error(e));

    // TODO health not available
    // user cancelled the dialog
    this.health.isAvailable()
      .then((available: boolean) => {

        console.log('health is available ?  : ' + available);
        if (available) {
          this.health.requestAuthorization([{
            read: ['steps']
          }])
            .then(res => this.debug1 = res)
            .catch(e => this.debug1 = '{debug : error},' + e);

        }

      })
      .catch(e => console.log('health is available ? ', e));

    this.pedometer.isStepCountingAvailable().then(stepsAvailable => {
      console.log('is step count available ? ' + stepsAvailable);
      if (stepsAvailable) {
        this.pedometer.startPedometerUpdates()
          .subscribe((data: IPedometerData) => {
            // console.log('pedometer data', JSON.stringify(data));
            if (this.isInResgiter) {
              // console.log('pedometer is in register');
              this.steps = data.numberOfSteps;
            }
          });
      }

    });


  }

  runLocation() {
    const watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
      // console.log('runLocation data', data);
      if (this.isInResgiter && data.coords) {
        // console.log('runLocation inRegister data', data, data.coords.latitude, data.coords.longitude);
        this.myCoordinates.push(new Coordinate(
          data.coords.latitude,
          data.coords.longitude,
          data.coords.altitude === null ? 0 : data.coords.altitude));
        this.initGraph();
        this.initMap();
        this.caculateDistance();
      }
    });
  }

  endRegister() {
    this.isInResgiter = false;

    console.log('creating a new SportTask : ');
    // TODO new sport task;
    // avoir les vrai attribut de la tache
    const st = new SportTask(
      'Sans nom',
      '',
      Tasker.getCategoryByName(Tasker.CATEGORY_NONE_TAG),
      moment(this.durationMoment),
      0,
      Math.floor((this.durationMoment / 3600000 + 1) % 24),
      Math.floor(this.durationMoment / 60000 % 60),
      [false, false, false, false, false, false, false],
      this.steps,
      this.heart,
      this.distance,
      this.timer
    );
    for (const c of this.myCoordinates) {
      st.addCoord(c);
    }
    console.log('sportActivity :: endRegieter');
    Tasker.getInstance().addSportTask(st);
    console.log('added new SportTask to Tasker', st);
    SQLitePersistor.saveToDB();
    this.navCtrl.popAll();

  }

  initGraph(): any {
    const labels: string[] = [];
    const data: number[] = [];

    // console.log('initGraph()', this.myCoordinates);
    for (const x of this.myCoordinates) {
      labels.push('');
      data.push(x.getHeight());
    }

    this.lineChartData = [{
      data: data,
      label: 'Elevation'
    }];
    this.lineChartLabels = labels;

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

    const mapOptions: google.maps.MapOptions = {
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      draggable: false,
      zoomControl: false,
      scrollwheel: false,
      disableDoubleClickZoom: true
    };

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    this.map.fitBounds(bounds);
    polyline.setMap(this.map);

  }


}
