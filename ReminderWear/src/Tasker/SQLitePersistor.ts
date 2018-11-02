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

  private constructor(sqlite: SQLite) {
    this.sqlite = sqlite;
    this.databaseReady = new BehaviorSubject(false);
    this.sqlite.create({
      name: 'remindwear.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        this.db = db;
        this.createDBs();
      })
      .catch(e => console.log('Erreur dans l\'ouverture de la BDD:' + e));

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

    // console.log('ajout des categories');
    // console.log('les categories préchargées sont ', JSON.stringify(Tasker.getListCategories()));
    // console.log('les catégories extraites sont ', JSON.stringify(categories));

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
    const db = this.db;
    console.log(JSON.stringify(categories));
    categories.forEach(function(cat: Category)  {
      if (cat.getName() !== Tasker.CATEGORY_NONE_TAG && cat.getName() !== Tasker.CATEGORY_SPORT_TAG) {
        console.log('inserting category ', cat.getName());
        db.executeSql('INSERT INTO Categories VALUES (?, ?, ?)', [
          cat.getID(),
          cat.getName(),
          cat.getColor()
        ]).then(res => {
          console.log('retour de l\'insertion de la cat ' + cat.getName() + ' : ', JSON.stringify(res));
        }).catch(e => {
          console.log('erreur d\'insertion : ');
          console.log(JSON.stringify(e));
        });
      }
    });


    // this.db.transaction(function(tx) {
    //     categories.forEach(function(cat: Category)  {
    //       if (cat.getName() !== Tasker.CATEGORY_NONE_TAG && cat.getName() !== Tasker.CATEGORY_SPORT_TAG) {
    //         tx.executeSql('INSERT INTO Categories VALUES (?, ?, ?)', [
    //           cat.getID(),
    //           cat.getName(),
    //           cat.getColor()
    //         ]);
    //       }
    //     });
    //   }
    // ).catch(error => {
    //   console.log('une erreur est survenue dans l\'insertion : ');
    //   console.log(JSON.stringify(error));
    // });

    // this.sqlite.create({
    //   name: 'remindwear.db',
    //   location: 'default'
    // })
    //   .then((db: SQLiteObject) => {
    //
    //   })
    //   .catch(e => console.log(e));
  }

  private saveSportTasksToDB(tasks: SportTask[]): void {
    if (tasks.length) { tasks = []; }
  }

  private loadCategoriesFromDB(): Category[] {
    const categories: Category[] = [];
    console.log('loadCategoriesFromDB');

    // TODO : existe pas ?
    // TODO ???
    // TODO ???
    // TODO ???
    // TODO ???
    // this.db.transaction(function(tx) {
    //   tx.executeSql('SELECT count(*) AS mycount FROM Categories', [], function(rs) {
    //     console.log('SELECT returned ', rs.rows);
    //     console.log(JSON.stringify(rs));
    //     console.log(rs.rows);
    //     console.log('done reading SELECT');
    //     // console.log('Record count (expected to be 2): ' + rs.rows.item(0).mycount);
    //   }, function(error) {
    //     console.log('SELECT error: ' + error.message);
    //   });
    // });

    // this.sqlite.create({
    //   name: 'remindwear.db',
    //   location: 'default'
    // })
    //   .then((db: SQLiteObject) => {
    //
    //   });

    console.log('loadCategoriesFromDB : done, extracted categories : ');
    console.log(JSON.stringify(categories));

    return categories;
  }

  private loadTasksFromDB(): Task[] {
    return [];
  }

  private loadSportTasksFromDB(): SportTask[] {
    return [];
  }

  private truncateDBs(): void {
    // this.sqlite.create({
    //   name: 'remindwear.db',
    //   location: 'default'
    // })
    //   .then((db: SQLiteObject) => {
    //
    //
    //   })
    //   .catch(e => console.log(e));

    this.db.transaction(function(tx) {
        tx.executeSql('TRUNCATE TABLE SportTasks');
        tx.executeSql('TRUNCATE TABLE HeartRate');
        tx.executeSql('TRUNCATE TABLE Coordinates');
        tx.executeSql('TRUNCATE TABLE Tasks');
        tx.executeSql('TRUNCATE TABLE Categories');
      }
    ).catch(error => console.log(error));

  }

  private createDBs() {
    this.db.transaction(function(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS Categories (' +
          'ID INTEGER PRIMARY KEY, ' +
          'name TEXT, icon TEXT, ' +
          'color TEXT)'
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
        this.databaseReady.next(true);
      } );
  }
}
