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
    this.truncateDBs();
    const db = this.db;
    console.log(JSON.stringify(categories));
    categories.forEach(function(cat: Category)  {
      if (cat.getName() !== Tasker.CATEGORY_NONE_TAG && cat.getName() !== Tasker.CATEGORY_SPORT_TAG) {
        db.executeSql('INSERT INTO `Categories` (name, icon, color) VALUES (?, ?, ?)', [
          // cat.getID(),
          cat.getName(),
          cat.getIcon(),
          cat.getColor()
          // 'example en dur', 'ios.alarm', '#FFFFFF'
        ]).then(res => {
          console.log('retour de l\'insertion de la cat "' + cat.getName() + '" : ', JSON.stringify(res));
          cat.setID(res.insertId);
          console.log('Verification de l\'insert');
          db.executeSql('SELECT * FROM `Categories`', [])
            .then(res2 => {
              console.log('returned :', JSON.stringify(res2.rows), 'resultats');
              console.log('row n° insertId : ', JSON.stringify(res2.rows.item(res.insertId)));
              console.log('row n° 0 : ', JSON.stringify(res2.rows.item(0)));
            })
            .catch(e => console.log('erreur de lecture', JSON.stringify(e)));
        }).catch(e => {
          console.log('erreur d\'insertion : ');
          console.log(JSON.stringify(e));
        });

        /////////////
        // db.executeSql('SELECT count(*) AS mycount FROM Categories', [])
        //   .then(rs => console.log('Record count (expected to be 2): ' + rs.rows.item(0).mycount))
        //   .catch(error => console.log('Error SQL statement', error.message));
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
    console.log('truncate DBs : '),
    this.db.executeSql('DROP TABLE IF EXISTS HeartRate')
      .then(() => console.log('HeartRate Truncated'))
      .catch(e => console.log('error truncating HeartRate: ', JSON.stringify(e)));

    this.db.executeSql('DELETE FROM SportTasks')
      .then(() => console.log('SportTasks Truncated'))
      .catch(e => console.log('error truncating SportTasks : ', JSON.stringify(e)));

    this.db.executeSql('DROP TABLE Coordinates')
      .then(() => console.log('Coordinates Truncated'))
      .catch(e => console.log('error truncating Coordinates: ', JSON.stringify(e)));

    this.db.executeSql('DROP TABLE Tasks')
      .then(() => console.log('Tasks Truncated'))
      .catch(e => console.log('error truncating Tasks : ', JSON.stringify(e)));

    this.db.executeSql('DROP TABLE Categories')
      .then(() => console.log('CategoriesTruncated'))
      .catch(e => console.log('error truncating Categories: ', JSON.stringify(e)));

    this.createDBs();
  }

  private createDBs() {
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
        this.databaseReady.next(true);
      } );
  }
}
