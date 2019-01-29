import {Category} from './Category';

import {Task} from './Task';
import {SportTask} from './SportTask';
import {SQLitePersistor} from './SQLitePersistor';

export class Tasker {

  private static INSTANCE: Tasker = null;
  private static listCategories: Category[] = [];
  private static listTasks: Task[] = [];
  private static listSportTasks: SportTask[] = [];

  public static getInstance(): Tasker {
    if (Tasker.INSTANCE == null) {
      Tasker.INSTANCE = new Tasker();
    }
    return Tasker.INSTANCE;
  }

  public static get CATEGORY_NONE_TAG(): string {
    return 'Aucune';
  }
  public static get CATEGORY_SPORT_TAG(): string {
    return 'Sport';
  }

  public static unserializeLists(): void {
    SQLitePersistor.loadFromDB();
  }

  public static serializeLists(): void {
    SQLitePersistor.saveToDB();
  }

  public static removeTask(t: Task): void {
    const index = this.listTasks.indexOf(t, 0);
    if (index > -1) {
      this.listTasks.splice(index, 1);
    }
  }

  public static removeTaskByID(id: number): void {
    const index = this.listTasks.indexOf(this.getTaskByID(id), 0);
    if (index > -1) {
      this.listTasks.splice(index, 1);
      console.log('removeTaskByID :: Task found, removing...');
    }
  }

  public static removeSportTask(t: SportTask): void {
    const index = this.listTasks.indexOf(t, 0);
    if (index > -1) {
      this.listSportTasks.splice(index, 1);
    }
  }

  public static removeSportTaskByID(id: number): void {
    let index = -1;
    for (let i = 0; i < this.listSportTasks.length; i++) {
      if (this.listSportTasks[i].getID() === id) {
        index = i;
        break;
      }
    }
    if (index !== -1) {
      // console.log('removeSportTaskByID :: SportTask found, removing SportTask with ID='+id + ' at index=' + index);
      // console.log('avant : ', this.listSportTasks);
      this.listSportTasks.splice(index, 1);
      // console.log('après : ', this.listSportTasks)
    }
  }

  public static getListSportTasks(): SportTask[] {
    return Tasker.listSportTasks;
  }

  public static getListTasks(): Task[] {
    return Tasker.listTasks;
  }

  public static getListCategories(): Category[] {
    return Tasker.listCategories;
  }

  public static getCategoryByID(id: number): Category {
    for (const c of Tasker.listCategories) {
      if (c.getID() === id) {
        return c;
      }
    }
    return null;
  }

  public static getTaskByID(id: number): Task {
    for (const t of this.listTasks) {
      if (t.getID() === id) {
        return t;
      }
    }
    return null;
  }


  public static getSportTaskByID(id: number): SportTask {
    for (const t of this.listSportTasks) {
      if (t.getID() === id) {
        return t;
      }
    }
    return null;
  }

  public static getCategoryByName(catName: string): Category {

    let cat = null;
    for (const c of this.listCategories) {
      if (c.getName() === catName) {
        cat =  c;
        break;
      }
    }

    return cat;
  }

  public static sort(): void {
    Tasker.listTasks.sort((n1, n2) => {
      if (n1.getNextDate().isAfter(n2.getNextDate())) {
        return 1;
      }
      if (n1.getNextDate().isBefore(n2.getNextDate())) {
        return -1;
      }
      return 0;
    });
  }

  public addCategory(c: Category): boolean {
    if (Tasker.getCategoryByName(c.getName()) === null) {
      Tasker.listCategories.push(c);
      return true;
    }
    return false;
  }

  public editCategoryById(id: number, c: Category): void {
    const cat = Tasker.getCategoryByID(id);
    cat.setColor(c.getColor());
    cat.setIcon(c.getIcon());
    cat.setName(c.getName());
  }

  public editTaskById(id: number, t: Task): void {
    const task = Tasker.getTaskByID(id);
    task.setName(t.getName());
    task.setDescription(t.getDescription());
    task.setDateDeb(t.getDateDeb());
    task.setWarningBefore(t.getWarningBefore());
    task.setIsActivatedNotification(t.getIsActivatedNotification());
    task.setTimeHour(t.getTimeHour());
    task.setTimeMinutes(t.getTimeMinutes());
    task.setPhoto(t.getPhoto());
    task.setLocalisation(t.getLocalisation());
    task.setCategory(t.getCategory());
    task.setRepete(t.getRepete());
  }

  public addTask(t: Task): boolean {
    if (Tasker.getTaskByID(t.getID()) === null) {
      Tasker.listTasks.push(t);
      return true;
    }
    return false;
  }

  public addSportTask(t: SportTask): boolean {
    if (Tasker.getSportTaskByID(t.getID()) === null) {
      Tasker.listSportTasks.push(t);
      return true;
    }
    return false;
  }

}
