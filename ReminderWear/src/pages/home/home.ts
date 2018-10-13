import {
  Component
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


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  searchQuery = '';
  items: Task[];
  orderBy = false;

  constructor(public navCtrl: NavController) {
    this.initializeItems();
    this.sort();
  }

  initializeItems() {
    const t = new Tasker();
    Tasker.unserializeLists();
    Tasker.getListTasks();

    const c = new Category('category XXX', 1, 2);
    const c2 = new Category('category 2', 1, 2);
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
    t.addTask(new Task('tache 3', 'description', c, moment(), 30, 12, 30));
    i = 0;
    while (i < 10000000) {
      i++;
    }
    t.addTask(new Task('tache 4', 'description', c, moment(), 30, 12, 30));
    this.items = Tasker.getListTasks();
  }

  getItems(ev: any) {
    this.items = Tasker.getListTasks();
    const val = ev.target.value;
    console.log(val);

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

  onItemClicked() {
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
