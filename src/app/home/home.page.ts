import {Component, ViewChild} from '@angular/core';
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
    public x = 0;
    public y = 0;
    public z = 0;
    public accX = 0;
    public accY = 0;
    public accZ = 0;
    public positionX: number;
    public positionY: number;
    public positionZ: number;
    private timestamp: any;


    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    };


    constructor(private deviceMotion: DeviceMotion, private gyroscope: Gyroscope, private api: HttpClient) {
        this.positionX = 0;
        this.positionY = 0;
        this.positionZ = 0;
        this.gyro();
    }


    gyro() {
        this.deviceMotion.getCurrentAcceleration().then().catch();


        this.deviceMotion.watchAcceleration({frequency: 100}).subscribe((acceleration: DeviceMotionAccelerationData) => {
            this.accX = acceleration.x;
            this.accZ = acceleration.z;
            this.accY = acceleration.y;
        });

        this.gyroscope.getCurrent().then().catch();

        this.gyroscope.watch({frequency: 100}).subscribe((orientation: GyroscopeOrientation) => {
            this.x = orientation.x;
            this.y = orientation.y;
            this.z = orientation.z;
            this.timestamp = orientation.timestamp;
        });

        setInterval(() => {
            this.position(this.accX, this.accY, this.accZ);
            this.Data = {
                x: this.x,
                y: this.y,
                z: this.z,
                positionX: this.positionX,
                positionY: this.positionY,
                positionZ: this.positionZ,
                accX: this.accX,
                accY: this.accY,
                accZ: this.accZ,
                timestamp: this.timestamp
            };
            this.Array.push(this.Data);
        }, 250);

        setInterval(() => {
            this.api.post(apiUrl + '/data', JSON.stringify(this.Array), this.httpOptions).subscribe();
            this.Array.splice(0, 60);

        }, 15000);
    }

    position(accX, accY, accZ) {
        this.positionX = Number(accX * 0.5 * 0.01) + Number(this.positionX) + Number(accX * 0.01);
        this.positionY = Number(accY * 0.5 * 0.01) + Number(this.positionY) + Number(accY * 0.01);
        this.positionZ = Number(accZ * 0.5 * 0.01) + Number(this.positionZ) + Number(accZ * 0.01);
    }




}
