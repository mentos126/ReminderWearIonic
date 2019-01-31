import {
    Category
} from './Category';
import {
    Moment
} from 'moment';
import * as moment from 'moment' ;
import { Coordinate } from './Coordinate';

export class Task {

    private ID: number;
    private name: string;
    private description: string;
    private category: Category;
    private dateDeb: Moment;
    private warningBefore: number;
    private isActivatedNotification: boolean;
    private timeHour = 0;
    private timeMinutes = 0;
    private repete: boolean[];
    private photo: string = null;
    private localisation: Coordinate = null;

    constructor(name: string, description: string, category: Category, dateDeb: Moment,
        warningBefore: number, timeHour: number, timeMinutes: number,
        repete: boolean[] = [false, false, false, false, false, false, false]) {
        this.ID = new Date().getTime() / 1000;
        this.name = name;
        this.description = description;
        this.category = category;
        this.dateDeb = dateDeb;
        this.warningBefore = warningBefore;
        this.setIsActivatedNotification(true);
        this.setTimeHour(timeHour);
        this.setTimeMinutes(timeMinutes);
        this.repete = repete;
    }

    public getID(): number {
        return this.ID;
    }

  setID(insertId: number) {
    this.ID = insertId;
  }

    public getName(): string {
        return this.name;
    }
    public setName(name: string): void {
        this.name = name;
    }

    public getDescription(): string {
        return this.description;
    }
    public setDescription(description: string): void {
        this.description = description;
    }

    public getCategory(): Category {
        return this.category;
    }
    public setCategory(category: Category): void {
        this.category = category;
    }

    public getDateDeb(): Moment {
        return this.dateDeb;
    }
    public setDateDeb(dateDeb: Moment): void {
        this.dateDeb = dateDeb;
    }

    public getWarningBefore(): number {
        return this.warningBefore;
    }

    public setWarningBefore(warningBefore: number): void {
        this.warningBefore = warningBefore;
    }

    public getIsActivatedNotification(): boolean {
        return this.isActivatedNotification;
    }
    public setIsActivatedNotification(isActivatedNotification: boolean): void {
        this.isActivatedNotification = isActivatedNotification;
    }

    public getRepete(): boolean[] {
        return this.repete;
    }
    public setRepete(index: boolean[]): void {
        this.repete = index;
    }

    public getRepeteToString(): string {
        if (this.getDateDeb() !== null) {
            return 'Une seule fois';
        }
        let res = '';
        for (let i = 0; i < this.getRepete().length; i++) {
            if (this.getRepete()[i]) {
                switch (i) {
                    case 0:
                        res += 'Lun. ';
                        break;
                    case 1:
                        res += 'Mar. ';
                        break;
                    case 2:
                        res += 'Mer. ';
                        break;
                    case 3:
                        res += 'Jeu. ';
                        break;
                    case 4:
                        res += 'Ven. ';
                        break;
                    case 5:
                        res += 'Sam. ';
                        break;
                    case 6:
                        res += 'Dim. ';
                        break;
                    default:
                        res += '';
                        break;

                }
            }
        }
        return res;
    }

    public getTimeHour(): number {
        return this.timeHour | 0;
    }
    public setTimeHour(time: number): void {
        this.timeHour = time;
    }

    public getTimeMinutes(): number {
        return this.timeMinutes | 0;
    }
    public setTimeMinutes(timeMinutes: number): void {
        this.timeMinutes = timeMinutes;
    }

    public toString(): string {
        let r = '';
        for (const x of this.repete) {
            r += '\n\t\t' + x;
        }
        return ' [ ' +
            '\n\t' + this.name +
            '\n\t' + this.description +
            '\n\t' + this.category +
            '\n\t' + this.dateDeb +
            '\n\t' + this.warningBefore +
            '\n\t' + this.timeHour +
            '\n\t' + this.timeMinutes +
            '\n\t' + this.isActivatedNotification +
            '\n\t[' +
            r +
            '\n\t]' +
            '\n] ';
    }

    public getNextDate(): Moment {
        if (this.dateDeb == null) {
            let day = 0;
            let first = -1;
            const today = moment().isoWeekday();

            for (let i = 0; i < this.getRepete().length; i++) {
                if ((i + 1 >= today) && this.getRepete()[i]) {
                    day = i + 1;
                    break;
                }
                if (first === -1 && this.getRepete()[i]) {
                  first = i + 1;
                }
            }

            let temp = null;
            if (today <= day) {
                temp = moment().isoWeekday(day);
            } else {
                temp = moment().add(1, 'weeks').isoWeekday(first);
            }
            temp.minutes(this.getTimeMinutes());
            temp.hours(this.getTimeHour());
            return temp;
        } else {
            const c = this.getDateDeb();
            c.minutes(this.getTimeMinutes());
            c.hours(this.getTimeHour());
            return c;
        }
    }

    public getPhoto(): string {
      return this.photo;
    }

    public setPhoto(photo: string): void {
      this.photo = photo;
    }

    public getLocalisation(): Coordinate {
      return this.localisation;
    }

    public setLocalisation(localisation: Coordinate): void {
      this.localisation = localisation;
    }


}
