import {Component, Input, OnInit} from '@angular/core';
import {BoardApi} from '../api/board.api';

@Component({
    selector: 'app-chess-error',
    templateUrl: './chess-error.component.html',
    styleUrls: ['./chess-error.component.scss']
})
export class ChessErrorComponent implements OnInit {

    @Input() board: any = null;

    constructor(private boardApi: BoardApi) {
    }

    ngOnInit() {
    }

    async resume() {

        await this.boardApi.resume();
    }

}
