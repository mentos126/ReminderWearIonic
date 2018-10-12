import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AddTaskPage } from '../add-task/add-task';

import { Tasker } from '../../Tasker/Tasker';
import { Task } from '../../Tasker/Task';
import { Category } from '../../Tasker/Category';
import * as moment from 'moment' ;


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  searchQuery = '';
  items: Task[];

  constructor(public navCtrl: NavController) {
    this.initializeItems();
  }

  initializeItems() {
    const t = new Tasker();
    const c = new Category('category XXX', 1, 2);
    t.addCategory(c);
    t.addTask(new Task('tache 1', 'description', c, moment(), 30, 12, 30));
    let i = 0;
    while(i< 10000000){
      i++;
    }
    t.addTask(new Task('tache 2', 'description', c, null, 30, 12, 30, [true, false, false, true, false, true, false]));
    i = 0;
    while(i< 10000000){
      i++;
    }
    t.addTask(new Task('tache 3', 'description', c, moment(), 30, 12, 30));
    i = 0;
    while(i< 10000000){
      i++;
    }
    t.addTask(new Task('tache 4', 'description', c, moment(), 30, 12, 30));
    this.items = Tasker.getListTasks();
  }

  getItems(ev: any) {
    this.items = Tasker.getListTasks();
    console.log(this.items)
    const val = ev.target.value;
    if (val && val.trim() !== '') {
      this.items = this.items.filter((item) => {
        return (item.getName().toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
    }
  }

  onItemClicked(){
    console.log("CARD");
  }

  onChangeActivated(id: number){
      console.log("get id", id);
  }

  addTask(){
    this.navCtrl.push(AddTaskPage);
  }

}
