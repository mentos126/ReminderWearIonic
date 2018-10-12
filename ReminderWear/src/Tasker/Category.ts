export class Category {

    private ID: number;
    private name: string;
    private icon: number;
    private color: number;

    constructor(name: string, icon: number, color: number) {
        this.ID = new Date().getTime() / 1000;
        this.name = name;
        this.icon = icon;
        this.color = color;
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

    public getIcon(): number {
        return this.icon;
    }
    public setIcon(icon: number): void {
        this.icon = icon;
    }

    public getColor(): number {
        return this.color;
    }
    public setColor(color: number): void {
        this.color = color;
    }

    public toString(): string {
        return ' [ ' +
            '\n\t' + this.name +
            '\n\t' + this.icon +
            '\n\t' + this.color +
            '\n] ';
    }

}
