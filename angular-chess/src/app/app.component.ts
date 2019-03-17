import {Component, OnInit} from '@angular/core';
import {IPieceModel} from './models/IPieceModel';
import {Store} from '@ngrx/store';
import {IBoardState} from './reducers/board-reducer.reducer';
import {Observable} from 'rxjs';
import {LoadGetBoards} from './actions/get-board.actions';
import {IBoardModel} from './models/IBoardModel';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    title = 'angular-chess';

    public board = null;

    public pieces: IPieceModel[] = [];

    board$: Observable<IBoardModel> = this.store.select(state => state.board);


    constructor(public store: Store<IBoardState>) {
    }

    async ngOnInit() {

        this.board$.subscribe((board: IBoardModel) => {
            this.board = board.board;

            console.log(board);
        });

        this.store.dispatch(new LoadGetBoards());

        setInterval(() => this.store.dispatch(new LoadGetBoards()), 2000);
    }

}
