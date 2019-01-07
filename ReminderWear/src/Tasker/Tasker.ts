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
    // console.log('getInstance()');
    if (Tasker.INSTANCE == null) {
      Tasker.INSTANCE = new Tasker();
      // console.log('created new instance');
      // console.log('new instance has ' + this.getListCategories().length + ' categories');
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
    console.log('deserialization');
    SQLitePersistor.loadFromDB();
  }

  public static serializeLists(): void {
    console.log('serialization');

    SQLitePersistor.saveToDB();
  }

  public static removeTask(t: Task): void {
    const index = this.listTasks.indexOf(t, 0);
    if (index > -1) {
      // console.log('remove task');
      this.listTasks.splice(index, 1);
    }
  }

  public static removeTaskByID(id: number): void {
    const index = this.listTasks.indexOf(this.getTaskByID(id), 0);
    if (index > -1) {
      this.listTasks.splice(index, 1);
    }
  }

  public static removeSportTask(t: SportTask): void {
    const index = this.listTasks.indexOf(t, 0);
    if (index > -1) {
      this.listSportTasks.splice(index, 1);
    }
  }

  public static removeSportTaskByID(id: number): void {
    let temp = -1;
    for (let i = 0; i < this.listSportTasks.length; i++) {
      if (this.listSportTasks[i].getID() === id) {
        temp = i;
        break;
      }
    }
    if (temp !== -1) {
      this.listSportTasks.slice(temp, 1);
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

  public static changeWithSaveIsActivatedNotification(t: Task): void {
    t.setIsActivatedNotification(!t.getIsActivatedNotification());
    this.serializeLists();
  }


  // public static garbageCollectOld(): void {
  //   this.unserializeLists();
  //   const deletes: number[] = [];
  //   const now = moment();
  //   for (let i = 0; i < this.listTasks.length; i++) {
  //     if (this.listTasks[i].getDateDeb() != null && this.listTasks[i].getNextDate().isBefore(now)) {
  //       deletes.push(this.listTasks[i].getID());
  //     }
  //   }
  //   for (const i of deletes) {
  //     this.removeTaskByID(i);
  //   }
  //   this.serializeLists();
  // }

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
    // console.log('getCat By Name : ' + catName);
    // if (Tasker.INSTANCE === null){
    //   this.getInstance();
    // }

    let cat = null;
    for (const c of this.listCategories) {
      if (c.getName() === catName) {
        cat =  c;
        break;
      }
    }

    console.log('recherche de la categorie ' + catName + ' a renvoyé ' + (cat === null ? null : '1 résultat'));

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

  // public static setListCategories(listCategories: Category[]): void {
  //   Tasker.listCategories = listCategories;
  // }
  public static setListTasks(listTasks: Task[]): void {
    Tasker.listTasks = listTasks;
  }

  public static setListSportTasks(listSportTasks: SportTask[]): void {
    Tasker.listSportTasks = listSportTasks;
  }

  // public constructor() {
  //   // console.log('new Tasker constructor');
  //   // Tasker.unserializeLists();
  //   // this.addCategory(new Category(Tasker.CATEGORY_NONE_TAG, 'alarm', '#f3f5e1'));
  //   // this.addCategory(new Category(Tasker.CATEGORY_SPORT_TAG, 'bicycle', '#f5f5f5'));
  //   // Tasker.serializeLists();
  //
  // }

  // public Tasker() {
  //   if (Tasker.INSTANCE == null) {
  //     Tasker.unserializeLists();
  //     this.addCategory(new Category(Tasker.CATEGORY_NONE_TAG, 'close', '#f3f5e1'));
  //     this.addCategory(new Category(Tasker.CATEGORY_SPORT_TAG, 'add', '#f5f5f5'));
  //     Tasker.serializeLists();
  //   }
  // }



  public setListCategories(listCategories: Category[]): void {
    Tasker.listCategories = listCategories;
  }

  public removeCategory(c: Category): void {
    const index = Tasker.listCategories.indexOf(c, 0);
    if (index > -1) {
      Tasker.listCategories.splice(index, 1);
    }
  }

  public addCategory(c: Category): boolean {
    if (Tasker.getCategoryByName(c.getName())=== null){
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

  public setListTasks(listTasks: Task[]): void {
    Tasker.listTasks = listTasks;
  }

  public addTask(t: Task): boolean {
    console.log('Add Task :: ' + t.getName());
    if (Tasker.getTaskByID(t.getID()) === null){
      Tasker.listTasks.push(t);
      console.log('task pushed');
      return true;
    }
    return false;
  }

  public setListSportTasks(listSportTasks: SportTask[]): void {
    Tasker.listSportTasks = listSportTasks;
  }

  public addSportTask(t: SportTask): boolean {
    if (Tasker.getSportTaskByID(t.getID()) === null){

      Tasker.listSportTasks.push(t);
      return true;
    }
    return false;
  }

}
