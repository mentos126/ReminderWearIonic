import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild
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
  myCoordinate: Coordinate = new Coordinate(0, 0, 0);

  constructor(public mapService: MapServiceProvider) {}

  ngOnInit(): void {
    this.subscription = this.mapService
      .currentCoordinate
      .subscribe(res => {
        if (res != null) {
          this.myCoordinate = res;
          this.initMap();
        }
      });

    this.initMap();
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  initMap(): void {
    const coords = new google.maps.LatLng(this.myCoordinate.getLat(), this.myCoordinate.getLng());
    const mapOptions: google.maps.MapOptions = {
      center: coords,
      zoom: 14,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    const marker = new google.maps.Marker({
      position: coords,
      draggable: true
    });

    marker.setMap(this.map);


    const coord: Coordinate = new Coordinate(0, 0, 0);
    marker.addListener('drag', function () {
      console.log('OUIOIOOIOOIO', marker.getPosition().lat);
      console.log(coord);
      this.mapService.currentCoordinate.changeCoordiante(coord);
      // this.myCoordinate.setLat(this.marker.getPosition().getLat());
      // map.setCenter(marker.getPosition());
    });
  }


}
