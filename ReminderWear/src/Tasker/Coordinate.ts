export class Coordinate {

    private lat: number;
    private lng: number;
    private h: number;

    public Coordonate(lat: number, lng: number, height: number) {
        this.lat = lat;
        this.lng = lng;
        this.h = height;
    }

    public getLat(): number {
        return this.lat;
    }
    public setLat(lat: number): void {
        this.lat = lat;
    }

    public getLng(): number {
        return this.lng;
    }
    public setLng(lng: number): void {
        this.lng = lng;
    }

    public getHeight(): number {
        return this.h;
    }
    public setHeight(height: number): void {
        this.h = height;
    }
}
