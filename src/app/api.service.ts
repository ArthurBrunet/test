import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import {Data} from './Models/Data';
import {Observable} from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

const apiUrl = 'http://185.216.25.16:3000/datas';




@Injectable({
    providedIn: 'root'
})


export class ApiService {


    constructor(public http: HttpClient) { }

    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    };

    createItem(item) {
        return this.http.post(apiUrl + '/add', JSON.stringify(item), this.httpOptions);
    }

}
