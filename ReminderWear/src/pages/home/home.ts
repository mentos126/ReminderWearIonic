import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';
import {
  NavController
} from 'ionic-angular';
import {
  AddTaskPage
} from '../add-task/add-task';

import {
  Tasker
} from '../../Tasker/Tasker';
import {
  Task
} from '../../Tasker/Task';
import {
  Category
} from '../../Tasker/Category';
import * as moment from 'moment';
import { EditTaskPage } from '../edit-task/edit-task';
import { TaskerServiceProvider } from '../../providers/tasker-service/tasker-service';
import {
  ISubscription
} from 'rxjs/Subscription';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit, OnDestroy {

  private subscription: ISubscription;
  searchQuery = '';
  items: Task[];
  orderBy = false;

  constructor(public navCtrl: NavController, private taskService: TaskerServiceProvider) {
    this.initializeItems();
    this.sort();
  }

  ngOnInit(): void {
    this.subscription = this.taskService
      .currentTask
      .subscribe();
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ionViewDidLoad() { }

  initializeItems() {
    const t = new Tasker();
    Tasker.unserializeLists();

    // TODO REMOVE FROM
    Tasker.getListTasks();
    const c = new Category('Aucune', 'ios-add-circle', '#abcdef');
    const c2 = new Category('category 2', 'ios-alarm', '#f5f5f5');
    t.addCategory(c);
    t.addCategory(c2);
    t.addTask(new Task('tache 1', 'description', c, moment(), 30, 12, 30));
    let i = 0;
    while (i < 10000000) {
      i++;
    }
    t.addTask(new Task('tache 2', 'description', c, null, 30, 12, 30, [true, false, false, true, false, true, false]));
    i = 0;
    while (i < 10000000) {
      i++;
    }
    t.addTask(new Task('tache 3', 'description', c2, moment(), 30, 12, 30));
    i = 0;
    while (i < 10000000) {
      i++;
    }
    t.addTask(new Task('tache 4', 'description', c, moment(), 30, 12, 30));
    // TODO END

    this.items = Tasker.getListTasks();

  }

  getItems(ev: any) {
    this.items = Tasker.getListTasks();
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
    this.taskService.changeTask(Tasker.getTaskByID(id));
    this.navCtrl.push(EditTaskPage);
  }

  onChangeActivated(id: number) {
    const temp = Tasker.getTaskByID(id);
    temp.setIsActivatedNotification(!temp.getIsActivatedNotification());
  }

  addTask() {
    this.navCtrl.push(AddTaskPage);
  }

  sort(): void {
    if (this.items !== undefined && this.items.length > 0) {
      this.orderBy = !this.orderBy;
      this.items.sort((n1, n2) => {
        if (this.orderBy) {
          if (n1.getNextDate().isAfter(n2.getNextDate())) {
            return 1;
          }
          if (n1.getNextDate().isBefore(n2.getNextDate())) {
            return -1;
          }
        } else {
          if (n1.getNextDate().isBefore(n2.getNextDate())) {
            return 1;
          }
          if (n1.getNextDate().isAfter(n2.getNextDate())) {
            return -1;
          }
        }
        return 0;
      });
    }
  }

}
