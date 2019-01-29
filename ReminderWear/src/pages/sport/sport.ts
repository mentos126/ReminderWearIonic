import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavController} from 'ionic-angular';
import {Tasker} from '../../Tasker/Tasker';
import {SportDetailPage} from '../sport-detail/sport-detail';

import {TaskerServiceProvider} from '../../providers/tasker-service/tasker-service';
import {SportTask} from '../../Tasker/SportTask';
import {ISubscription} from 'rxjs/Subscription';
import {SQLitePersistor} from "../../Tasker/SQLitePersistor";

@Component({
  selector: 'page-sport',
  templateUrl: 'sport.html'
})
export class SportPage implements OnInit, OnDestroy {

  private subscription: ISubscription;
  searchQuery = '';
  items: SportTask[];

  constructor(public navCtrl: NavController, private taskService: TaskerServiceProvider) {
  }

  ngOnInit(): void {

    this.subscription = this.taskService
      .currentSportTask
      .subscribe();

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ionViewDidLoad() {
    // console.log('sports.ts :: onViewDidLoad')
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter !')
    this.initializeItems();
    this.sort();
  }


  initializeItems() {
    console.log('sports.ts initialize items');
    console.log('before : ', this.items);
    // Tasker.unserializeLists();
    SQLitePersistor.loadFromDB().then(() => {
      this.items = Tasker.getListSportTasks();
      console.log('after : ', this.items);
    });
  }

  getItems(ev) {
    console.log('getItems');
    SQLitePersistor.loadFromDB().then(() => {
      this.items = Tasker.getListSportTasks();
      // console.log('getItems a rendu : ', this.items);
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
    });


  }

  onItemClicked(id: number) {
    this.taskService.changeSportTask(Tasker.getSportTaskByID(id));
    this.navCtrl.push(SportDetailPage);
  }

  onChangeActivated(id: number) {
    const taskId = Tasker.getTaskByID(id);
    taskId.setIsActivatedNotification(!taskId.getIsActivatedNotification());
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
