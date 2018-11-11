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
import * as moment from 'moment';
import {Coordinate} from './Coordinate';
// import moment = require('moment');
//
// import * as moment from 'moment';


export class SQLitePersistor {
  private static INSTANCE: SQLitePersistor;
  private static DB_CONFIG = {
    name: 'remindwear.db',
    location: 'default'
  };
  private sqlite: SQLite;
  private db: SQLiteObject;
  private databaseReady: BehaviorSubject<boolean>;



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

    this.getInstance().truncateDBs().then( () => {
      SQLitePersistor.getInstance().saveCategoriesToDB(categories);
      SQLitePersistor.getInstance().saveTasksToDB(tasks);
      SQLitePersistor.getInstance().saveSportTasksToDB(sportTasks);
    } );



  }

  public static loadFromDB(): void {
    const categories = SQLitePersistor.getInstance().loadCategoriesFromDB();
    categories.push(new Category(Tasker.CATEGORY_NONE_TAG, 'close', '#f53d3d'));
    categories.push(new Category(Tasker.CATEGORY_SPORT_TAG, 'add', '#f5f5f5'));


    const tasks = SQLitePersistor.getInstance().loadTasksFromDB();
    const sportTasks = SQLitePersistor.getInstance().loadSportTasksFromDB();

    Tasker.getListCategories().forEach(value => categories.push(value));
    Tasker.setListCategories( categories );

    Tasker.setListTasks( tasks );
    Tasker.setListSportTasks( sportTasks);

  }

  public getDatabaseState(): Observable<boolean> {
    return this.databaseReady.asObservable();
  }



  public saveTasksToDB(tasks: Task[]): void {

    console.log(tasks.length + ' tasks to save on DB');

    const db = this.db;
    tasks.forEach(function(task: Task)  {
      console.log('Task ' + task.getName(), JSON.stringify(task) );
      const localisation = task.getLocalisation() === null ?
        null :
        [ task.getLocalisation().getLat(), task.getLocalisation().getLng(), task.getLocalisation().getHeight() ];
      const insertParams = [
        task.getName(),
        task.getDescription(),
        task.getCategory().getName(),
        task.getDateDeb().toISOString(true),
        task.getWarningBefore(),
        task.getIsActivatedNotification(),
        task.getTimeHour(),
        task.getTimeMinutes(),
        task.getRepete(),
        task.getPhoto(),
        localisation === null ? null : localisation.join(',')
      ];

      console.log('insert parameters : ', JSON.stringify(insertParams));
      db.executeSql('INSERT INTO `Tasks` (' +
        'name, description, categoryName, dateDebString, warningBefore, ' +
        'isActivatedNotification, timeHour, timeMinutes, repete, photo, localisation' +
        ') ' +
        'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', insertParams).then(res => {
        task.setID(res.insertId);
      }).catch(e => {
        console.log('erreur d\'insertion de la tâche ' + task.getName() + ' : ', JSON.stringify(e));
      });

    });

  }

  private saveCategoriesToDB(categories: Category[]): void {

    const db = this.db;
    categories.forEach(function(cat: Category)  {
      if (cat.getName() !== Tasker.CATEGORY_NONE_TAG && cat.getName() !== Tasker.CATEGORY_SPORT_TAG) {
        db.executeSql('INSERT INTO `Categories` (name, icon, color) VALUES (?, ?, ?)', [
          cat.getName(),
          cat.getIcon(),
          cat.getColor()
        ]).then(res => {
          cat.setID(res.insertId);
        }).catch(e => {
          console.log('erreur d\'insertion de la categorie ' + cat.getName() + ' : ', JSON.stringify(e));
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
        console.log('SELECT * from Categories returned :', res.rows.length , 'results');
        for (let i = 0; i < res.rows.length; i++) {
          const sqlCat = res.rows.item(i);
          categories.push( new Category(sqlCat.name, sqlCat.icon, sqlCat.color));
        }
      })
      .catch(e => console.log('erreur de lecture', JSON.stringify(e)));
    return categories;
  }

  private loadTasksFromDB(): Task[] {
    const tasks: Task[] = [];

    this.db.executeSql('SELECT * FROM `Tasks`', [])
      .then(res => {
        console.log('SELECT * from Task returned :', res.rows.length , 'results');
        for (let i = 0; i < res.rows.length; i++) {
          const sqlTask = res.rows.item(i);
          console.log('SQL Task returned : ', JSON.stringify(sqlTask));

          const repete: boolean[] = [];
          const sqlRepete: string = sqlTask.repete;
          sqlRepete.split(',').forEach(bool => {
              repete.push( bool === 'true' );
            }
          );

          // console.log('creating temp task');

          const t = new Task(
            sqlTask.name,
            sqlTask.description,
            Tasker.getCategoryByName( sqlTask.categoryName ),
            moment( sqlTask.dateDebString ),
            sqlTask.warningBefore,
            sqlTask.timeHour,
            sqlTask.timeMinutes,
            repete
          );
          t.setID(i);

          t.setIsActivatedNotification(
            sqlTask.isActivatedNotification === 'true'
          );
          // console.log('setting photo');
          if (sqlTask.photo !== null) {
            t.setPhoto(sqlTask.photo);
          }
          // console.log('setting localisation');
          if (sqlTask.localisation !== null) {
            const strCoords  = sqlTask.localisation.split(',');
            const coords: Coordinate = new Coordinate(
              strCoords[0], strCoords[1], strCoords[2]
            );
            t.setLocalisation(coords);
          }

          // console.log('Tache extraite :', JSON.stringify(t));

           tasks.push(t);
        }
      })
      .catch(e => console.log('erreur de lecture', JSON.stringify(e)));
    return tasks;
  }

  private loadSportTasksFromDB(): SportTask[] {
    return [];
  }

  private async truncateDBs() {
    console.log('truncate DBs');
    const tableNames = [
      'HeartRate', 'SportTasks', 'Coordinates', 'Tasks', 'Categories'
    ];

    return this.db.transaction(function (tx) {
      tableNames.forEach(tableName => {
        tx.executeSql('DELETE FROM ' + tableName);
      });
    });
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
          'categoryName TEXT, ' +
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
      .then( () => {
        if (notify) {
          this.databaseReady.next(true);
        }
      } );
  }
}
