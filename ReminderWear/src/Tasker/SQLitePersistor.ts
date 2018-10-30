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
    console.log('INIT du SQLitePersistor');

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

    SQLitePersistor.getInstance().saveCategoriesToDB(categories);
    SQLitePersistor.getInstance().saveTasksToDB(tasks);
    SQLitePersistor.getInstance().saveSportTasksToDB(sportTasks);

  }

  public loadFromDB(): void {
    console.log('loadFromDB');

    const categories = SQLitePersistor.getInstance().loadCategoriesFromDB();
    const tasks = SQLitePersistor.getInstance().loadTasksFromDB();
    const sportTasks = SQLitePersistor.getInstance().loadSportTasksFromDB();

    Tasker.setListCategories( categories );
    Tasker.setListTasks( tasks );
    Tasker.setListSportTasks( sportTasks);
    console.log('loadFromDB :: done');

  }

  public saveTasksToDB(tasks : Task[]): void {
    if(tasks.length){ tasks = []; }

  }

  private saveCategoriesToDB(categories : Category[]): void {
    if(categories.length){ categories = []; }
  }

  private saveSportTasksToDB(tasks : SportTask[]): void {
    if(tasks.length){ tasks = []; }
  }

  private loadCategoriesFromDB() : Category[] {
    return [];
  }

  private loadTasksFromDB() : Task[] {
    return [];
  }

  private loadSportTasksFromDB() : SportTask[] {
    return [];
  }

}
