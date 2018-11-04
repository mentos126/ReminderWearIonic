import {
  Component,
  OnInit,
  OnDestroy
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
import {
  ISubscription
} from 'rxjs/Subscription';
import {
  Geolocation
} from '@ionic-native/geolocation';
import {
  MapServiceProvider
} from '../../providers/map-service/map-service';

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

  private subscription: ISubscription;
  private myCoordinate: Coordinate = null;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public viewCtrl: ViewController, private geolocation: Geolocation,
    private mapService: MapServiceProvider) {}

  ionViewDidLoad() { }

  ngOnInit(): void {
    this.initGeo();
    this.subscription = this.mapService
      .currentCoordinate
      .subscribe(res => {
        this.myCoordinate = res;
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  initGeo(): any {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.myCoordinate = new Coordinate(resp.coords.latitude, resp.coords.longitude, 0);
      this.mapService.changeCoordinate(this.myCoordinate);
    }).catch((error) => {
      console.log(error);
    });

    //  const watch = this.geolocation.watchPosition();
    //  watch.subscribe((data) => {
    //   // data can be a set of coordinates, or an error (if an error occurred).
    //   // data.coords.latitude
    //   // data.coords.longitude
    //  });
  }

  onSelectPosition() {
    this.viewCtrl.dismiss(this.myCoordinate);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
