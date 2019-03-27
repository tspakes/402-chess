import {Component, Input, OnInit} from '@angular/core';
import {BoardApi} from '../api/board.api';
import {Store} from "@ngrx/store";
import {ResumeBoard} from "../actions/get-board.actions";
import {IAppState} from "../reducers";

@Component({
    selector: 'app-chess-error',
    templateUrl: './chess-error.component.html',
    styleUrls: ['./chess-error.component.scss']
})
export class ChessErrorComponent implements OnInit {

    @Input() board: any = null;

    constructor(public store: Store<IAppState>) {
    }

    ngOnInit() {
    }

    async resume() {

        this.store.dispatch(new ResumeBoard());

    }
}
