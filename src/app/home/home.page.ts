import {Component} from '@angular/core';
import {DeviceMotion, DeviceMotionAccelerationData} from '@ionic-native/device-motion/ngx';
import {Gyroscope, GyroscopeOrientation, GyroscopeOptions} from '@ionic-native/gyroscope/ngx';
import {HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import {Data} from '../Models/Data';


const apiUrl = 'http://185.216.25.16:3000/data';


@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
    providers: [Gyroscope]
})


export class HomePage {

    public Array = [];
    public Data: Data;
    public x = 10;
    public y = 10;
    public z = 10;
    public accX = 10;
    public accY = 10;
    public accZ = 10;
    private timestamp: any;

    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    };


    constructor(private deviceMotion: DeviceMotion, private gyroscope: Gyroscope, private api: HttpClient) {
        this.gyro();
    }

    gyro() {
        this.deviceMotion.getCurrentAcceleration().then().catch();


        this.deviceMotion.watchAcceleration({frequency: 500}).subscribe((acceleration: DeviceMotionAccelerationData) => {
            this.accX = acceleration.x;
            this.accZ = acceleration.z;
            this.accY = acceleration.y;
        });

        this.gyroscope.getCurrent().then().catch();

        this.gyroscope.watch({frequency: 500}).subscribe((orientation: GyroscopeOrientation) => {
            this.x = orientation.x;
            this.y = orientation.y;
            this.z = orientation.z;
            this.timestamp = orientation.timestamp;
        });


        setInterval(() => {
            this.Data = {
                x: this.x,
                y: this.y,
                z: this.z,
                accX: this.accX,
                accY: this.accY,
                accZ: this.accZ,
                timestamp: this.timestamp
            };
            this.Array.push(this.Data);
        }, 500);

        setInterval(() => {
            this.api.post(apiUrl + '/data', JSON.stringify(this.Array), this.httpOptions).subscribe();
            this.Array.splice(0, 10);

        }, 5000);
    }

}
