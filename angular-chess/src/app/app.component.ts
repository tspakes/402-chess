import {Component, OnInit} from '@angular/core';
import {IPieceModel} from './models/IPieceModel';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {LoadGetBoards} from './actions/get-board.actions';
import {IAppState} from "./reducers";
import {IBoardState} from "./reducers/board-reducer.reducer";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    title = 'angular-chess';

    public board = null;

    public pieces: IPieceModel[] = [];

    board$: Observable<IBoardState> = this.store.select(state => state.board);


    constructor(public store: Store<IAppState>) {
    }

    async ngOnInit() {

        this.board$.subscribe((board: IBoardState) => {
            this.board = board.board;
        });

        this.store.dispatch(new LoadGetBoards());

        setInterval(() => this.store.dispatch(new LoadGetBoards()), 500);
    }

}
