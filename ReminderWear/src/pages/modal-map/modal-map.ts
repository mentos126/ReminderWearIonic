import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController,
  AlertController
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
import {
  Diagnostic
} from '@ionic-native/diagnostic';


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
  private myCoordinate: Coordinate = new Coordinate(43.8, 3.6, -1);
  private isInstancied = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private geolocation: Geolocation,
    private mapService: MapServiceProvider,
    private diagnostic: Diagnostic,
    private alertCtrl: AlertController
  ) {}

  ionViewDidLoad() {}

  ngOnInit(): void {
    this.subscription = this.mapService
      .currentCoordinate
      .subscribe();

    this.presentConfirm();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getMyCoordinate(): Coordinate {
    return this.myCoordinate;
  }

  presentConfirm() {

    this.diagnostic.isLocationAvailable()
      .then((state) => {
        if (!state) {
          const alert = this.alertCtrl.create({
            title: 'Activation du GPS',
            message: 'Voulez vous activer le GPS?',
            buttons: [{
                text: 'Non',
                handler: () => {
                  this.myCoordinate = new Coordinate(43.8, 3.6, 0);
                  this.isInstancied = true;
                }
              },
              {
                text: 'Oui',
                handler: () => {
                  this.initGeo();
                }
              }
            ]
          });
          alert.present();
        } else {
          this.initGeo();
        }
      }).catch(e => {
        console.error(e);
        this.initGeo();
      });

  }

  initGeo(): any {

    this.diagnostic.isLocationAvailable()
      .then((state) => {
        if (!state) {
          this.diagnostic.switchToLocationSettings();
        }
      }).catch(e => console.error(e));

    this.geolocation.getCurrentPosition().then((resp) => {
      if (!this.isInstancied) {
        this.myCoordinate = new Coordinate(resp.coords.latitude, resp.coords.longitude, 0);
        this.isInstancied = true;
      }
    }).catch((error) => {
      console.error('erreur getCurrentPosition', error);
    });

    const watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
      if (!this.isInstancied && data.coords) {
        this.myCoordinate = new Coordinate(data.coords.latitude, data.coords.longitude, 0);
        this.isInstancied = true;
      }
    });

  }

  onSelectPosition() {
    this.viewCtrl.dismiss(this.myCoordinate);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
