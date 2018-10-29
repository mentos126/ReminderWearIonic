import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

import {
  Category
} from './Category';

import {
  Task
} from './Task';
import {
  SportTask
} from './SportTask';

import {
  Tasker
} from './Tasker';



export class SQLitePersistor {
  private static INSTANCE: SQLitePersistor;
  // private db: any;
  // private tasker: Tasker = Tasker.getInstance();
  private sqlite: SQLite;

  private constructor(/*private sqlite: SQLite*/){

    this.sqlite = new SQLite();
    this.sqlite.echoTest().then(value => console.log(value));


    this.sqlite.create({
      name: 'remindwear.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        console.log('DB created  : ', db);


        db.executeSql('create table danceMoves(name VARCHAR(32))', [])
          .then(() => console.log('Executed SQL'))
          .catch(e => console.log(e));
      })
      .catch(e => console.log(e));


    // db.transaction(function(tx) {
    //   tx.executeSql('CREATE TABLE IF NOT EXISTS DemoTable (name, score)');
    //   tx.executeSql('INSERT INTO DemoTable VALUES (?,?)', ['Alice', 101]);
    //   tx.executeSql('INSERT INTO DemoTable VALUES (?,?)', ['Betty', 202]);
    // }, function(error) {
    //   console.log('Transaction ERROR: ' + error.message);
    // }, function() {
    //   console.log('Populated database OK');
    // });

  }

  public static getInstance(): SQLitePersistor {
    if (SQLitePersistor.INSTANCE == null) {
      SQLitePersistor.INSTANCE = new SQLitePersistor();
    }
    return SQLitePersistor.INSTANCE;
  }

  public static saveToDB(): void {
    const tasks = Tasker.getListTasks();
    const sportTasks = Tasker.getListSportTasks();
    const categories = Tasker.getListCategories();

    this.saveCategoriesToDB(categories);
    this.saveTasksToDB(tasks);
    this.saveSportTasksToDB(sportTasks);

  }

  public static loadFromDB(): void {
    const categories = this.loadCategoriesFromDB();
    const tasks = this.loadTasksFromDB();
    const sportTasks = this.loadSportTasksFromDB();

    Tasker.setListCategories( categories );
    Tasker.setListTasks( tasks );
    Tasker.setListSportTasks( sportTasks);

  }

  public static saveTasksToDB(tasks : Task[]): void {
    if(tasks.length){ tasks = []; }

  }

  public static saveCategoriesToDB(categories : Category[]): void {
    if(categories.length){ categories = []; }
  }

  public static saveSportTasksToDB(tasks : SportTask[]): void {
    if(tasks.length){ tasks = []; }
  }

  public static loadCategoriesFromDB() : Category[] {
    return [];
  }

  public static loadTasksFromDB() : Task[] {
    return [];
  }

  public static loadSportTasksFromDB() : SportTask[] {
    return [];
  }

}
