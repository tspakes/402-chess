import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class BoardApi {


    private endpoint = 'http://localhost:3000';

    constructor(private httpClient: HttpClient) {

    }

    public getBoard(): Promise<any> {

        return this.httpClient.get(`${this.endpoint}/board`).toPromise();
    }
}
