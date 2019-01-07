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
import {BehaviorSubject} from 'rxjs';
// import {BehaviorSubject, Observable} from 'rxjs';
import * as moment from 'moment';
import {Coordinate} from './Coordinate';


export class SQLitePersistor {
  private static INSTANCE: SQLitePersistor;
  private static DB_CONFIG = {
    name: 'remindwear.db',
    location: 'default'
  };
  public static databaseReady: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private sqlite: SQLite;
  private db: SQLiteObject;



  private constructor(sqlite: SQLite) {

    this.sqlite = sqlite;
    // this.databaseReady = new BehaviorSubject(false);
    this.sqlite.create(SQLitePersistor.DB_CONFIG)
      .then((db: SQLiteObject) => {
        this.db = db;
        this.createDBs(true);
      })
      .catch(e => console.log('Erreur dans l\'ouverture de la BDD:' , e));

  }



  public  static initInstance(sql: SQLite) {
    // console.log("SQL init instance")
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
    // console.log('Save to DB ...');
    Tasker.getInstance();
    const tasks = Tasker.getListTasks();
    const sportTasks = Tasker.getListSportTasks();
    const categories = Tasker.getListCategories();
    console.log('saving ' + tasks.length + ' tasks, ' + sportTasks.length + ' sportTasks, ' + categories.length + ' categories');

    this.getInstance().truncateDBs().then( () => {
      SQLitePersistor.getInstance().saveCategoriesToDB(categories);
      SQLitePersistor.getInstance().saveTasksToDB(tasks);
      SQLitePersistor.getInstance().saveSportTasksToDB(sportTasks);
    } );



  }

  public static async loadFromDB() {
    console.log('Load from DB');
    // const categories = SQLitePersistor.getInstance().loadCategoriesFromDB();
    SQLitePersistor.getInstance().loadCategoriesFromDB().then(categories => {
      categories.push(new Category(Tasker.CATEGORY_NONE_TAG, 'alarm', '#f3f5e1'));
      categories.push(new Category(Tasker.CATEGORY_SPORT_TAG, 'bicycle', '#f5f5f5'));




      Tasker.getListCategories().forEach(value => categories.push(value));
      for (let cat of categories){
        Tasker.getInstance().addCategory(cat);
        // Tasker.getInstance().addCategory()setListCategories(categories);
      }

      SQLitePersistor.getInstance().loadTasksFromDB().then(tasks => {
        for (let task of tasks){
          Tasker.getInstance().addTask(task);
        }

        SQLitePersistor.getInstance().loadSportTasksFromDB().then(sportTasks => {

          for (let sportTask of sportTasks){
            Tasker.getInstance().addSportTask(sportTask);

            // Tasker.setListSportTasks(sportTasks);
          }

          console.log('Loaded ' + tasks.length + ' tasks, ' + categories.length + ' categories, ' + sportTasks.length + ' sporttasks');
        });

      });





    });






  }

  public saveTasksToDB(tasks: Task[]) {

    // console.log(tasks.length + ' tasks to save on DB');

    // const sqlp: SQLitePersistor = this;
    // const db = this.db;

    for (let i = 0; i < tasks.length; i++){
      const task = tasks[i];
      this.saveTaskToDB(task);
    }

    // tasks.forEach(function(task: Task)  {
    //   // console.log('Task ' + task.getName(), JSON.stringify(task) );
    //   await sqlp.saveTaskToDB(task);
    // });

  }



  private saveCoords(taskId: number, coordinate: Coordinate) {

    const h = coordinate.getHeight();
    const lat = coordinate.getLat();
    const lng = coordinate.getLng();

    this.db.executeSql('INSERT INTO `Coordinates` (' +
      'sportTaskId, lng, lat, h) ' +
      'VALUES (?, ?, ?, ?)', [taskId, lng, lat, h]).then(() => {
    }).catch(e => {
      console.log('erreur d\'insertion des coordonnées pour le sport ' + taskId + ' : ', JSON.stringify(e));
    });

  }

  private async getSportTaskCoords(taskId: number) {
    const coords: Coordinate[] = [];

     await this.db.executeSql('SELECT * FROM `Coordinates` WHERE sportTaskId = ?', [taskId])
      .then(res => {
        // console.log('SELECT * from Categories returned :', res.rows.length , 'results');
        for (let i = 0; i < res.rows.length; i++) {
          const c = res.rows.item(i);
          coords.push(new Coordinate(c.lat, c.lng, c.h));
        }
      })
      .catch(e => console.log('erreur de lecture', JSON.stringify(e)));

    return coords;
  }

  private saveCategoriesToDB(categories: Category[]): void {

    const db = this.db;
    categories.forEach(function(cat: Category)  {
      // console.log('Saving category ' + cat.getName());
      if (cat.getName() !== Tasker.CATEGORY_NONE_TAG && cat.getName() !== Tasker.CATEGORY_SPORT_TAG) {
        console.log('saving category ' + cat.getName());
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

  public async saveTaskToDB(task: Task) {

    const localisation = task.getLocalisation() === null ?
      null :
      [ task.getLocalisation().getLat(), task.getLocalisation().getLng(), task.getLocalisation().getHeight() ];
    const insertParams = [
      task.getName(),
      task.getDescription(),
      task.getCategory().getName(),
      task.getDateDeb() ? task.getDateDeb().toISOString(true) : null,
      task.getWarningBefore(),
      task.getIsActivatedNotification(),
      task.getTimeHour(),
      task.getTimeMinutes(),
      task.getRepete(),
      task.getPhoto(),
      localisation === null ? null : localisation.join(','),
      task instanceof SportTask
    ];

    console.log('Saving task ' + task.getName() + ' (Sport = ' + (task instanceof SportTask) + ')');

    // console.log('insert parameters : ', JSON.stringify(insertParams));
    await this.db.executeSql('INSERT INTO `Tasks` (' +
      'name, description, categoryName, dateDebString, warningBefore, ' +
      'isActivatedNotification, timeHour, timeMinutes, repete, photo, localisation, isSport) ' +
      'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', insertParams).then(res => {
      console.log('got insertId=' + res.insertId + ' for task ID = ' + task.getID());
      task.setID(res.insertId); // TODO : remove ?
    }).catch(e => {
      console.log('erreur d\'insertion de la tâche ' + task.getName() + ' : ', JSON.stringify(e), insertParams);
    });

  }

  private saveSportTasksToDB(sportTasks: SportTask[]) {
    console.log('saving ' + sportTasks.length + ' sportTasks');


    sportTasks.forEach( async st => {
      console.log('Saving sportTask ' + st.getName() + ' (ID=' + st.getID() + ')');

      await this.saveTaskToDB(st);
      const taskId = st.getID();
      console.log('SportTask ID is now ' + taskId);
      // step heart, distance, duration
      // coords
      const coords: Coordinate[] = st.getListCoord();
      for (let i = 0; i < coords.length; i++) {
        this.saveCoords(taskId, coords[i]);
      }

      // 'TaskID INTEGER, ' +
      // 'steps INT, ' +
      // 'heart INT, ' +
      // 'distance REAL, ' +
      // 'duration REAL

      const insertParams = [
        st.getID(),
        st.getSteps(),
        st.getHeart(),
        st.getDistance(),
        st.getDuration()
      ];

      this.db.executeSql('INSERT INTO `SportTasks` (' +
        'TaskID, steps, heart, distance, duration) ' +
        'VALUES (?, ?, ?, ?, ?)', insertParams).then(() => {
        console.log('Sport Task inseree avec succes');
      }).catch(e => {
        console.log('erreur d\'insertion de la tâche de sport ' + st.getName() + ' : ', JSON.stringify(e), JSON.stringify(insertParams));
      });


    } );

    if (sportTasks.length) { sportTasks = []; }
  }

  private async loadCategoriesFromDB() {
    const categories: Category[] = [];

    await this.db.executeSql('SELECT * FROM `Categories`', [])
      .then(res => {
        // console.log('SELECT * from Categories returned :', res.rows.length , 'results');
        for (let i = 0; i < res.rows.length; i++) {
          const sqlCat = res.rows.item(i);
          categories.push( new Category(sqlCat.name, sqlCat.icon, sqlCat.color));
          console.log('loading category ' + sqlCat.name);
        }
      })
      .catch(e => console.log('erreur de lecture', JSON.stringify(e)));
    return categories;
  }

  private async loadTasksFromDB(){
    const tasks: Task[] = [];

    await this.db.executeSql('SELECT * FROM `Tasks` T WHERE isSport = \'false\' ', [])
      .then(res => {
        // console.log('SELECT * from Task returned :', res.rows.length , 'results');
        for (let i = 0; i < res.rows.length; i++) {
          const sqlTask = res.rows.item(i);
          // console.log('SQL Task returned : ', JSON.stringify(sqlTask));

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

           tasks.push(t);
          console.log('loading task ' + t.getName() + ' (isSport=' + (t instanceof SportTask) + ')');
        }
      })
      .catch(e => console.log('erreur de lecture des taches', JSON.stringify(e)));
    return tasks;
  }

  private async loadSportTasksFromDB() {
    console.log('Load SportTasks from DB...');
    const sportTasks: SportTask[] = [];

    await this.db.executeSql('SELECT * FROM `SportTasks` ST INNER JOIN Tasks T ON T.ID = ST.TaskID', [])
      .then(async res => {
        // console.log(res.rows.length + ' sportTasks found in DB with a join');
        for (let i = 0; i < res.rows.length; i++) {
          const st = res.rows.item(i);

          console.log(JSON.stringify(st));
          const repete: boolean[] = st.repete;


          const sportTask: SportTask = new SportTask(
            st.name,
            st.description,
            Tasker.getCategoryByName(st.categoryName),
            moment(st.dateDebutString),
            st.warningBefore,
            st.timeHout,
            st.timeMinutes,
            repete,
            st.steps,
            st.heart,
            st.distance,
            st.duration
          );

          sportTask.setID(st.ID);

          console.log('loading sportTask extraite : ', sportTask);

          const coords: Coordinate[] = await this.getSportTaskCoords(st.ID);
          console.log('coordonnees associees : ', coords);


          coords.forEach(coord => {
            sportTask.addCoord(coord);
          });


          sportTasks.push(sportTask);

        }
      })
      .catch(e => console.log('erreur de lecture', JSON.stringify(e)));

    return sportTasks;
  }

  private async truncateDBs() {
    // console.log('truncate DBs');
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
    // console.log("SQL create DBs");
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
          'isSport INT DEFAULT 0, ' +
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
          'sportTaskId INT, ' +
          'lat REAL, ' +
          'lng REAL, ' +
          'h TEXT ' +
          ')');

        tx.executeSql('CREATE TABLE IF NOT EXISTS HeartRate (' +
          'SportTaskID INT, ' +
          'value INT, ' +
          'datetime TEXT)');

        tx.executeSql('CREATE TABLE IF NOT EXISTS SportTasks (' +
          'TaskID INTEGER PRIMARY KEY, ' +
          'steps INT, ' +
          'heart INT, ' +
          'distance REAL, ' +
          'duration REAL)');
      }
    )
      .catch(error => console.log(error))
      .then( () => {
        if (notify) {
          // this.databaseReady.next(true);
          SQLitePersistor.databaseReady.next(true);
        }
      } );
  }


}
