import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {IBoardModel} from "../models/IBoardModel";
import {PieceType} from "../models/IPieceModel";

@Injectable({
    providedIn: 'root'
})
export class BoardApi {


    private endpoint = 'http://localhost';

    constructor(private httpClient: HttpClient) {

    }

    public getBoard(): Observable<IBoardModel> {

        return this.httpClient.get<IBoardModel>(`${this.endpoint}/board`);
    }

    public resume(): Promise<any> {

        return this.httpClient.post(`${this.endpoint}/board/resume`, {}).toPromise();
    }

    public promote(type: PieceType): Observable<IBoardModel> {

        return this.httpClient.post<IBoardModel>(`${this.endpoint}/board/promote/${type}`, {});
    }
}

