import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {IBoardModel} from "../models/IBoardModel";
import {PieceType} from "../models/IPieceModel";
import {environment} from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class BoardApi {


    private readonly endpoint;

    constructor(private httpClient: HttpClient) {

        if (environment.production === true) {
            this.endpoint = window.location.href.substr(0, window.location.href.lastIndexOf('/'));
        } else {
            this.endpoint = "http://chesspi.nomads.utk.edu"

        }

    }

    public getBoard(): Observable<IBoardModel> {

        return this.httpClient.get<IBoardModel>(`${this.endpoint}/board`);
    }

    public resume(): Observable<IBoardModel> {

        return this.httpClient.post<IBoardModel>(`${this.endpoint}/board/resume`, {});
    }

    public commit(): Observable<IBoardModel> {

        return this.httpClient.post<IBoardModel>(`${this.endpoint}/board/commit`, {});

    }

    public reset(): Observable<IBoardModel> {

        return this.httpClient.post<IBoardModel>(`${this.endpoint}/board/reset`, {});

    }

    public undo(): Observable<IBoardModel> {

        return this.httpClient.post<IBoardModel>(`${this.endpoint}/board/undo`, {});

    }

    public cancel(): Observable<IBoardModel> {

        return this.httpClient.post<IBoardModel>(`${this.endpoint}/board/cancel`, {});

    }

    public promote(type: PieceType): Observable<IBoardModel> {

        return this.httpClient.post<IBoardModel>(`${this.endpoint}/board/promote/${type}`, {});
    }

    public history(): Observable<IBoardModel> {

        return this.httpClient.get<IBoardModel>(`${this.endpoint}/board/history`);
    }
}

