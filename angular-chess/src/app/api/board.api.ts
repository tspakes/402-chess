import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {IBoardModel} from "../models/IBoardModel";
import {PieceType} from "../models/IPieceModel";

@Injectable({
    providedIn: 'root'
})
export class BoardApi {


    private endpoint = 'http://chesspi.nomads.utk.edu';

    constructor(private httpClient: HttpClient) {

    }

    public getBoard(): Observable<IBoardModel> {

        return this.httpClient.get<IBoardModel>(`${this.endpoint}/board`);
    }

    public resume(): Promise<any> {

        return this.httpClient.post(`${this.endpoint}/board/resume`, {}).toPromise();
    }

    public commit(): Observable<IBoardModel> {

        return this.httpClient.post<IBoardModel>(`${this.endpoint}/board/commit`, {});

    }

    public reset(): Observable<IBoardModel> {

        return this.httpClient.post<IBoardModel>(`${this.endpoint}/board/reset`, {});

    }

    public promote(type: PieceType): Observable<IBoardModel> {

        return this.httpClient.post<IBoardModel>(`${this.endpoint}/board/promote/${type}`, {});
    }
}

