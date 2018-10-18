import {
  BehaviorSubject
} from 'rxjs/BehaviorSubject';
import {
  Injectable
} from '@angular/core';
import {
  Task
} from '../../Tasker/Task';
import { Category } from '../../Tasker/Category';

/*
  Generated class for the TaskerServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TaskerServiceProvider {

  private task = new BehaviorSubject < Task > (null);
  currentTask = this.task.asObservable();

  private category = new BehaviorSubject < Category > (null);
  currentCategory = this.category.asObservable();

  constructor() {}

  changeTask(t: Task) {
    this.task.next(t);
  }

  changeCategory(c: Category) {
    this.category.next(c);
  }

}
