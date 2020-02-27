import {Component, ViewChild} from '@angular/core';
import {DeviceMotion, DeviceMotionAccelerationData} from '@ionic-native/device-motion/ngx';
import {Gyroscope, GyroscopeOrientation, GyroscopeOptions} from '@ionic-native/gyroscope/ngx';
import {HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';

import {Data} from '../Models/Data';
import {Result} from '../Models/Result';
import {element} from 'protractor';


const apiUrl = 'http://185.216.25.16:5000/datas';


@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
    providers: [Gyroscope]
})


export class HomePage {
    public Array = [];
    public pseudo: string;
    public step = 0;
    public affETX = 0;
    public affETY = 0;
    public affETZ = 0;
    public Data: Data;

    public result: Result;

    public maxX: number;
    public minX: number;

    public maxY: number;
    public minY: number;

    public maxZ: number;
    public minZ: number;

    public x = 0;
    public y = 0;
    public z = 0;

    public accX = 0;
    public accY = 0;
    public accZ = 0;

    public positionX = 0;
    public positionY = 0;
    public positionZ = 0;

    private timestamp: any;


    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    };


    constructor(private deviceMotion: DeviceMotion, private gyroscope: Gyroscope, private api: HttpClient) {
        this.minX = 0;
        this.maxX = 0;
        this.minY = 0;
        this.maxY = 0;
        this.minZ = 0;
        this.maxZ = 0;
    }


    gyro() {

        document.getElementById('button').style.display = 'none';
        document.getElementById('pseudoTXT').style.display = 'none';


        this.deviceMotion.getCurrentAcceleration().then().catch();

        this.deviceMotion.watchAcceleration({frequency: 50}).subscribe((acceleration: DeviceMotionAccelerationData) => {
            this.accX = acceleration.x;
            this.accZ = acceleration.z;
            this.accY = acceleration.y;
        });

        setInterval(() => {
            this.position(this.accX, this.accY, this.accZ);
            if (this.minX > this.accX) {
                this.minX = this.accX;
            }
            if (this.maxX < this.accX) {
                this.maxX = this.accX;
            }
            if (this.minY > this.accY) {
                this.minY = this.accY;
            }
            if (this.maxY < this.accY) {
                this.maxY = this.accY;
            }
            if (this.minZ > this.accZ) {
                this.minZ = this.accZ;
            }
            if (this.maxZ < this.accZ) {
                this.maxZ = this.accZ;
            }
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
                timestamp: this.timestamp,
                pseudo: this.pseudo
            };

            this.Array.push(this.Data);
        }, 50);

        setInterval(() => {
            const x = (this.maxX - this.minX);
            const y = (this.maxY - this.minY);
            const z = (this.maxZ - this.minZ);
            this.result = {
                X: x,
                Y: y,
                Z: z,
            };
            const AxeMax = Math.max(this.result.X, this.result.Y, this.result.Z);

            if ( this.result.X == AxeMax) {
                let treshold = ((this.minX + this.maxX) / 2);
                let somme = 0;
                let moyenne = 0;
                this.Array.forEach(function(element) {
                    moyenne += element.accX;
                });
                moyenne = (moyenne / this.Array.length );

                for (let i = 0; i < this.Array.length; i++) {
                    somme += (Math.pow(this.Array[i]["accX"] - moyenne, 2));
                }

                for (let i = 0; i < this.Array.length; i++) {

                    const et = Math.sqrt((somme / (this.Array.length - 1)));
                    this.affETX = et;
                    let a = i + 1;

                    if (i !== (this.Array.length - 1) && (treshold < et || treshold > (et * -1))) {
                        if (this.Array[i]["accX"] >= treshold && this.Array[a]["accX"] <= treshold) {
                            this.step++;
                        }
                    }
                }
            }
            if ( this.result.Y == AxeMax ) {
                let treshold = ((this.minY + this.maxY) / 2);
                let somme = 0;
                let moyenne = 0;
                this.Array.forEach(function(element) {
                    moyenne += element.accX;
                });
                moyenne = (moyenne / this.Array.length );

                for (let i = 0; i < this.Array.length; i++) {
                    somme += (Math.pow(this.Array[i]["accY"] - moyenne, 2));
                }


                for (let i = 0; i < this.Array.length; i++) {
                    const et = Math.sqrt((somme / (this.Array.length - 1)));
                    let a = i + 1;
                    this.affETY = et;
                    if (i !== (this.Array.length - 1) && (treshold < et || treshold > (et * -1))) {
                        if (this.Array[i]["accY"] >= treshold && this.Array[a]["accY"] <= treshold) {
                            this.step++;
                        }
                    }
                }
            }
            if ( this.result.Z == AxeMax ) {
                let treshold = ((this.minZ + this.maxZ) / 2);
                let somme = 0;
                let moyenne = 0;
                this.Array.forEach(function(element) {
                    moyenne += element.accX;
                });
                moyenne = (moyenne / this.Array.length );

                for (let i = 0; i < this.Array.length; i++) {
                    somme += (Math.pow(this.Array[i]["accZ"] - moyenne, 2));
                }
                for (let i = 0; i < this.Array.length; i++) {
                    const et = Math.sqrt((somme / (this.Array.length - 1)));
                    let a = i + 1;
                    this.affETZ = et;

                    if (i !== (this.Array.length - 1) && (treshold < et || treshold > (et * -1))) {
                        if (this.Array[i]["accZ"] >= treshold && this.Array[a]["accZ"] <= treshold) {
                            this.step++;
                        }
                    }
                }
            }

            // this.api.post(apiUrl + '/add', JSON.stringify(this.Array), this.httpOptions).subscribe();
            this.Array.splice(0, 50);
            this.result.X = 0;
            this.result.Y = 0;
            this.result.Z = 0;
            this.maxX = 0;
            this.minX = 0;
            this.maxY = 0;
            this.minY = 0;
            this.maxZ = 0;
            this.minZ = 0;
        }, 1000);
    }

    position(accX, accY, accZ) {
        this.positionX = Number(accX * 0.5 * 0.01) + Number(this.positionX) + Number(accX * 0.01);
        this.positionY = Number(accY * 0.5 * 0.01) + Number(this.positionY) + Number(accY * 0.01);
        this.positionZ = Number(accZ * 0.5 * 0.01) + Number(this.positionZ) + Number(accZ * 0.01);
    }




}
