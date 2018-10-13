import {
    Task
} from './Task';
import {
    Coordinate
} from './Coordinate';
import {
    Category
} from './Category';
import {Moment} from 'moment';

export class SportTask extends Task {

    private listCoord: Coordinate[] = [];
    private steps: number;
    private heart: number;
    private distance: number;
    private duration: number;

    constructor(name: string, description: string, category: Category, dateDeb: Moment  ,
        warningBefore: number, timeHour: number, timeMinutes: number, repete: boolean[],
        steps: number, heart: number, distance: number, duration: number) {
        super(name, description, category, dateDeb, warningBefore, timeHour, timeMinutes, repete);
        this.distance = distance;
        this.steps = steps;
        this.heart = heart;
        this.duration = duration;
    }


    public addCoord(c: Coordinate): void {
        this.listCoord.push(c);
    }
    public getListCoord(): Coordinate[] {
        return this.listCoord;
    }

    public getSteps(): number {
        return this.steps;
    }
    public setSteps(steps: number): void {
        this.steps = steps;
    }

    public getHeart(): number {
        return this.heart;
    }
    public setHeart(heart: number): void {
        this.heart = heart;
    }

    public getDistance(): number {
        return this.distance;
    }
    public setDistance(distance: number): void {
        this.distance = distance;
    }

    public getDuration(): number {
        return this.duration;
    }
    public setDurationSecondes(duration: number): void {
        this.duration = duration;
    }

    public caculateDistance(): void {
        let res = 0;
        for (let i = 0; i < this.listCoord.length; i++) {
            if (i !== 0) {
                res += this.distanceBetweenTwoPoint(this.listCoord[i - 1], this.listCoord[i]);
            }
        }
        this.setDistance(res);
    }

    public distanceBetweenTwoPoint(c1: Coordinate, c2: Coordinate): number {

        const R = 6371;

        const latDistance = (c2.getLat() - c1.getLat()) * Math.PI / 180;
        const lonDistance = (c2.getLng() - c1.getLng()) * Math.PI / 180;
        const a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2) +
            Math.cos((c1.getLat()) * Math.PI / 180) * Math.cos((c2.getLat() * Math.PI / 180)) *
            Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        let distance = R * c * 1000;

        const height = c1.getHeight() - c2.getHeight();

        distance = Math.pow(distance, 2) + Math.pow(height, 2);

        return Math.sqrt(distance);
    }

}
