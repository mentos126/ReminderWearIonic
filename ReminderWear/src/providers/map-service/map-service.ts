import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Coordinate } from '../../Tasker/Coordinate';


/*
  Generated class for the MapServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MapServiceProvider {

  private coord = new BehaviorSubject < Coordinate > (null);
  currentCoordinate = this.coord.asObservable();

  constructor() {  }

  changeCoordinate(c: Coordinate) {
    this.coord.next(c);
  }

}
