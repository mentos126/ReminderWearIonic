import {
    Category
} from './Category';
import {
    Moment
} from 'moment';
import * as moment from 'moment' ;

export class Task {

    private ID: number;
    private name: string;
    private description: string;
    private category: Category;
    private dateDeb: Moment;
    private warningBefore: number;
    private isActivatedNotification: boolean;
    private timeHour: number;
    private timeMinutes: number;
    private repete: boolean[];

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
    public setRepete(index: number): void {
        this.repete[index] = !this.repete[index];
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
        return this.timeHour;
    }
    public setTimeHour(time: number): void {
        this.timeHour = time;
    }

    public getTimeMinutes(): number {
        return this.timeMinutes;
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
            let first = 0;
            let day = 0;
            for (let i = 0; i < this.getRepete().length; i++) {
                if (this.getRepete()[i] && first === 0) {
                    first = i;
                }
                if ((i + 1 >= moment().isoWeekday()) && this.getRepete()[i]) {
                    day = i;
                    break;
                }
            }
            const today = moment().isoWeekday();
            if (today <= day) {
                return moment().isoWeekday(day + 1);
            } else {
                return moment().add(1, 'weeks').isoWeekday(day);
            }
        } else {
            const c = this.getDateDeb();
            c.minutes(this.getTimeMinutes());
            c.hours(this.getTimeHour());
            return c;
        }
    }






    /*

        private long getDateDiff(Date date1, Date date2, TimeUnit timeUnit) {
            long diffInMillies = date2.getTime() - date1.getTime();
            return timeUnit.convert(diffInMillies,TimeUnit.MILLISECONDS);
        }

    	public long getDuration(TimeUnit timeUnit){
    		Calendar cal = getNextDate();
    		cal.set(Calendar.HOUR, getTimeMinutes());
    		cal.set(Calendar.MINUTE, getTimeMinutes());
    		cal.add(Calendar.MINUTE, -1 * getWarningBefore());
    		//cal.roll(Calendar.MINUTE, getWarningBefore());
    	    Date mDate  = getNextDate().getTime();
            return getDateDiff(mDate,new Date(),timeUnit);
        }

    */


}
