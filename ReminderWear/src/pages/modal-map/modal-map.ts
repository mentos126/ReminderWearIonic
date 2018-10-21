import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild
} from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController
} from 'ionic-angular';
import {
  Coordinate
} from '../../Tasker/Coordinate';

// import {} from '@types/googlemaps';
import { Geolocation } from '@ionic-native/geolocation';

/**
 * Generated class for the ModalMapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-map',
  templateUrl: 'modal-map.html',
})
export class ModalMapPage implements OnInit, OnDestroy {

  private myCoordinate: Coordinate = null;
  @ViewChild('map') mapElement;
  map: any;
  private myLatLng: google.maps.LatLng = new google.maps.LatLng(10, 10);

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public viewCtrl: ViewController, private geolocation: Geolocation) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalMapPage');
  }
  ngOnInit(): void {
    this.initMap();
    this.initGeo();
    console.log(this.myLatLng);
  }

  initGeo(): any {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.myLatLng = new  google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      console.log(this.myLatLng);
     }).catch((error) => {
       console.log('Error getting location', error);
     });

     const watch = this.geolocation.watchPosition();
     watch.subscribe((data) => {
       console.log(data);
      // data can be a set of coordinates, or an error (if an error occurred).
      // data.coords.latitude
      // data.coords.longitude
     });
  }

  ngOnDestroy(): void {}

  initMap(): void {
    const marker = new google.maps.Marker({
      position: this.myLatLng,
      title: 'selection de la position'
    });
    console.log(marker);
    this.map = new google.maps.Map(this.mapElement.nativeElement);
    console.log(this.map);
    marker.setMap(this.map);
  }

  onSelectPosition() {
    // this.myCoordinate = new Coordinate(this.myLatLng.lat, this.myLatLng.lng, 0);
    this.myCoordinate = new Coordinate(5, 5, 0);
    this.dismiss();
  }

  dismiss() {
    this.viewCtrl.dismiss(this.myCoordinate);
  }



}
