import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  Input
} from '@angular/core';
import {
  ISubscription
} from 'rxjs/Subscription';
import {
  MapServiceProvider
} from '../../providers/map-service/map-service';
import {
  Coordinate
} from '../../Tasker/Coordinate';

/**
 * Generated class for the GoogleMapComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'google-map',
  templateUrl: 'google-map.html'
})
export class GoogleMapComponent implements OnInit, OnDestroy {

  private subscription: ISubscription;
  @ViewChild('map') mapElement;
  map: any;
  isCreated = false;
  // myCoordinate: Coordinate = new Coordinate(44.6363264, 4.8412287999999997, 0);
  myCoordinate: Coordinate ;
  @Input()
  localisation: Coordinate;
  @Input()
  isDrag: boolean;

  constructor(public mapService: MapServiceProvider) {}

  ngOnInit(): void {
    if (this.isDrag) {
      this.subscription = this.mapService
        .currentCoordinate
        .subscribe(
          // res => {
        //   if (!this.isCreated) {
        //     if (res != null) {
        //       this.myCoordinate = res;
        //       this.initMapForModal();
        //       this.isCreated = true;
        //     }
        //   }
        // }
        );
      this.initMapForModal();
    } else {
      this.initMapForHome();
    }
  }

  ngOnDestroy(): void {
    if (this.isDrag) {
      this.mapService.changeCoordinate(this.myCoordinate);
      this.subscription.unsubscribe();
    }
  }

  initMapForHome(): void {
    const coords = new google.maps.LatLng(this.localisation.getLat(), this.localisation.getLng());
    const mapOptions: google.maps.MapOptions = {
      center: coords,
      zoom: 14,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    const marker = new google.maps.Marker({
      position: coords,
      draggable: this.isDrag
    });

    marker.setMap(this.map);

  }

  changeMyCoordinateMarker() {
    this.mapService.changeCoordinate(this.myCoordinate);
  }

  initMapForModal(): void {
    let coords = null;
    if (this.localisation.getHeight() !== -1) {
      coords = new google.maps.LatLng(this.localisation.getLat(), this.localisation.getLng());
    } else {
      coords = new google.maps.LatLng(43.8, 3.6);
    }
    this.myCoordinate = this.localisation;
    const mapOptions: google.maps.MapOptions = {
      center: coords,
      zoom: 14,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    const marker = new google.maps.Marker({
      position: coords,
      draggable: this.isDrag
    });

    marker.setMap(this.map);

    const self = this;
    marker.addListener('drag', function () {
      self.myCoordinate = new Coordinate(marker.getPosition().lat(), marker.getPosition().lng(), 0);
      self.changeMyCoordinateMarker();
    });
  }


}
