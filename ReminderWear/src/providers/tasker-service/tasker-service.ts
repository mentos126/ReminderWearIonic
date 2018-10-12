import {
  BehaviorSubject
} from 'rxjs/BehaviorSubject';
import {
  Injectable
} from '@angular/core';
import {
  Task
} from '../../Tasker/Task';

/*
  Generated class for the TaskerServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TaskerServiceProvider {

  private tasks = new BehaviorSubject < Task > (null);
  currentTasks = this.tasks.asObservable();

  constructor() {}

}
