export class Category {

    private ID: number;
    private name: string;
    private icon: string;
    private color: string;

    constructor(name: string, icon: string, color: string) {
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

    public getIcon(): string {
        return this.icon;
    }
    public setIcon(icon: string): void {
        this.icon = icon;
    }

    public getColor(): string {
        return this.color;
    }
    public setColor(color: string): void {
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
