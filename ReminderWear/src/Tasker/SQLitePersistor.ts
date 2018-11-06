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
import {BehaviorSubject, Observable} from 'rxjs';

export class SQLitePersistor {
  private static INSTANCE: SQLitePersistor;
  private sqlite: SQLite;
  private db: SQLiteObject;
  private databaseReady: BehaviorSubject<boolean>;

  private static DB_CONFIG = {
    name: 'remindwear.db',
    location: 'default'
  };

  private constructor(sqlite: SQLite) {
    this.sqlite = sqlite;
    this.databaseReady = new BehaviorSubject(false);
    this.sqlite.create(SQLitePersistor.DB_CONFIG)
      .then((db: SQLiteObject) => {
        this.db = db;
        this.createDBs(true);
      })
      .catch(e => console.log('Erreur dans l\'ouverture de la BDD:' , e));

  }



  public static initInstance(sql: SQLite) {
    if (SQLitePersistor.INSTANCE == null) {
      SQLitePersistor.INSTANCE = new SQLitePersistor(sql);
    }
  }

  public static getInstance(): SQLitePersistor {
    if (SQLitePersistor.INSTANCE == null) {
      throw new Error('Instance de SQLitePersistor non initialisée, appeler initInstance() au préalable');
    }
    return SQLitePersistor.INSTANCE;
  }

  public static saveToDB(): void {
    const tasks = Tasker.getListTasks();
    const sportTasks = Tasker.getListSportTasks();
    const categories = Tasker.getListCategories();

    this.getInstance().truncateDBs();

    SQLitePersistor.getInstance().saveCategoriesToDB(categories);
    SQLitePersistor.getInstance().saveTasksToDB(tasks);
    SQLitePersistor.getInstance().saveSportTasksToDB(sportTasks);

  }

  public static loadFromDB(): void {
    console.log('loadFromDB');


    const categories = SQLitePersistor.getInstance().loadCategoriesFromDB();
    categories.push(new Category(Tasker.CATEGORY_NONE_TAG, 'close', '#f53d3d'));
    categories.push(new Category(Tasker.CATEGORY_SPORT_TAG, 'add', '#f5f5f5'));


    const tasks = SQLitePersistor.getInstance().loadTasksFromDB();
    const sportTasks = SQLitePersistor.getInstance().loadSportTasksFromDB();

    Tasker.getListCategories().forEach(value => categories.push(value));
    Tasker.setListCategories( categories );
    // console.log('les categories resultantes sont ', JSON.stringify(Tasker.getListCategories()));


    Tasker.setListTasks( tasks );
    Tasker.setListSportTasks( sportTasks);
    console.log('loadFromDB :: done');

  }

  public getDatabaseState(): Observable<boolean> {
    return this.databaseReady.asObservable();
  }



  public saveTasksToDB(tasks: Task[]): void {
    if (tasks.length) { tasks = []; }

  }

  private saveCategoriesToDB(categories: Category[]): void {
    console.log('SAVING CATEGORIES !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    this.truncateDBs();
    const db = this.db;
    console.log(JSON.stringify(categories));
    categories.forEach(function(cat: Category)  {
      if (cat.getName() !== Tasker.CATEGORY_NONE_TAG && cat.getName() !== Tasker.CATEGORY_SPORT_TAG) {
        db.executeSql('INSERT INTO `Categories` (name, icon, color) VALUES (?, ?, ?)', [
          cat.getName(),
          cat.getIcon(),
          cat.getColor()
        ]).then(res => {
          cat.setID(res.insertId);
        }).catch(e => {
          console.log('erreur d\'insertion : ', JSON.stringify(e));
        });
      }
    });

  }

  private saveSportTasksToDB(tasks: SportTask[]): void {
    if (tasks.length) { tasks = []; }
  }

  private loadCategoriesFromDB(): Category[] {
    const categories: Category[] = [];

    this.db.executeSql('SELECT * FROM `Categories`', [])
      .then(res => {
        console.log('returned :', res.rows.length , 'resultats');
        for (let i = 0; i < res.rows.length; i++) {
          const sqlCat = res.rows.item(i);
          categories.push( new Category(sqlCat.name, sqlCat.icon, sqlCat.color));
        }
      })
      .catch(e => console.log('erreur de lecture', JSON.stringify(e)));
    return categories;
  }

  private loadTasksFromDB(): Task[] {
    return [];
  }

  private loadSportTasksFromDB(): SportTask[] {
    return [];
  }

  private truncateDBs(): void {
    console.log('truncate DBs : ');
    this.sqlite.deleteDatabase(SQLitePersistor.DB_CONFIG);
    this.sqlite.create(SQLitePersistor.DB_CONFIG);
    // this.db.executeSql('DELETE FROM HeartRate WHERE SportTaskID IS NOT NULL')
    //   .then(() => console.log('HeartRate Truncated'))
    //   .catch(e => console.log('error truncating HeartRate: ', JSON.stringify(e)));
    //
    // this.db.executeSql('DELETE FROM SportTasks')
    //   .then(() => console.log('SportTasks Truncated'))
    //   .catch(e => console.log('error truncating SportTasks : ', JSON.stringify(e)));
    //
    // this.db.executeSql('DROP TABLE Coordinates')
    //   .then(() => console.log('Coordinates Truncated'))
    //   .catch(e => console.log('error truncating Coordinates: ', JSON.stringify(e)));
    //
    // this.db.executeSql('DROP TABLE Tasks')
    //   .then(() => console.log('Tasks Truncated'))
    //   .catch(e => console.log('error truncating Tasks : ', JSON.stringify(e)));

      // this.db.executeSql('DELETE FROM Categories WHERE ID IS NOT NULL')
      //   .then(() => console.log('Categories Truncated'))
      //   .catch(e => console.log('error dropping Categories: ', JSON.stringify(e)));

    // this.db.executeSql('DROP TABLE Categories')
    //   .then(() => console.log('CategoriesTruncated'))
    //   .catch(e => console.log('error dropping Categories: ', JSON.stringify(e)));

    this.createDBs(false);
  }

  private createDBs(notify: boolean) {
    this.db.transaction(function(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS Categories (' +
          'ID INTEGER PRIMARY KEY, ' +
          'name TEXT NOT NULL, ' +
          'icon TEXT NOT NULL, ' +
          'color TEXT NOT NULL)'
        );
        tx.executeSql('CREATE TABLE IF NOT EXISTS Tasks (' +
          'ID INTEGER PRIMARY KEY, ' +
          'name TEXT, ' +
          'description TEXT, ' +
          'category INT, ' +
          'dateDebString TEXT, ' +
          'warningBefore INT, ' +
          'isActivatedNotification INT, ' +
          'timeHour INT, ' +
          'timeMinutes INT, ' +
          'repete INT, ' +
          'photo TEXT, ' +
          'localisation TEXT)');

        tx.executeSql('CREATE TABLE IF NOT EXISTS Coordinates (' +
          'SportTaskId INT, ' +
          'latitude TEXT, ' +
          'longitude TEXT, ' +
          'ALTITUDE TEXT, ' +
          'datetime TEXT)');

        tx.executeSql('CREATE TABLE IF NOT EXISTS HeartRate (' +
          'SportTaskID INT, ' +
          'value INT, ' +
          'datetime TEXT)');

        tx.executeSql('CREATE TABLE IF NOT EXISTS SportTasks (' +
          'TaskID INT, ' +
          'steps INT, ' +
          'distance REAL, ' +
          'duration REAL)');
      }
    )
      .catch(error => console.log(error))
      .then( value => {
        console.log('done creating the DBs : ', value);
        if (notify) {
          this.databaseReady.next(true);
        }
      } );
  }
}
