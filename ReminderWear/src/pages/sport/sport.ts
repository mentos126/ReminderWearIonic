import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';
import {
  NavController
} from 'ionic-angular';
import {
  Tasker
} from '../../Tasker/Tasker';
import {
  SportDetailPage
} from '../sport-detail/sport-detail';

import {
  TaskerServiceProvider
} from '../../providers/tasker-service/tasker-service';
import {
  SportTask
} from '../../Tasker/SportTask';

import * as moment from 'moment';
import {
  Coordinate
} from '../../Tasker/Coordinate';
import {
  ISubscription
} from 'rxjs/Subscription';

@Component({
  selector: 'page-sport',
  templateUrl: 'sport.html'
})
export class SportPage implements OnInit, OnDestroy {

  private subscription: ISubscription;
  searchQuery = '';
  items: SportTask[];

  constructor(public navCtrl: NavController, private taskService: TaskerServiceProvider) {
    this.initializeItems();
    this.sort();
  }

  ngOnInit(): void {

    this.subscription = this.taskService
      .currentSportTask
      .subscribe();

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ionViewDidLoad() {  }

  initializeItems() {
    Tasker.unserializeLists();

    // TODO remove
    const temp = new SportTask('name', 'description', Tasker.getListCategories()[0], moment(), 30, 12, 30, [], 3210, 124, 12, 3620);
    temp.addCoord(new Coordinate(1, 2, 3));
    temp.addCoord(new Coordinate(2, 3, 4));
    temp.addCoord(new Coordinate(3, 4, 5));
    temp.addCoord(new Coordinate(4, 5, 6));
    temp.addCoord(new Coordinate(5, 6, 7));
    temp.addCoord(new Coordinate(-12, 16, 7));
    temp.caculateDistance();
    Tasker.getListSportTasks()
      .push(temp);
    // END

    this.items = Tasker.getListSportTasks();
  }

  getItems(ev: any) {
    this.items = Tasker.getListSportTasks();
    const val = ev.target.value;
    if (val && val.trim() !== '') {
      this.items = this.items.filter((item) => {
        if (item.getName().toLowerCase().indexOf(val.toLowerCase()) > -1) {
          return true;
        }
        if (item.getDescription().toLowerCase().indexOf(val.toLowerCase()) > -1) {
          return true;
        }
        if (item.getCategory().getName().toLowerCase().indexOf(val.toLowerCase()) > -1) {
          return true;
        }
        if (item.getNextDate().format('DD MMM. YYYY').toLowerCase().indexOf(val.toLowerCase()) > -1) {
          return true;
        }
        return false;
      });
    }

  }

  onItemClicked(id: number) {
    this.taskService.changeSportTask(Tasker.getSportTaskByID(id));
    this.navCtrl.push(SportDetailPage);
  }

  onChangeActivated(id: number) {
    const temp = Tasker.getTaskByID(id);
    temp.setIsActivatedNotification(!temp.getIsActivatedNotification());
  }

  sort(): void {
    if (this.items !== undefined && this.items.length > 0) {
      this.items.sort((n1, n2) => {
        if (n1.getNextDate().isAfter(n2.getNextDate())) {
          return 1;
        }
        if (n1.getNextDate().isBefore(n2.getNextDate())) {
          return -1;
        }
        return 0;
      });
    }
  }

}
