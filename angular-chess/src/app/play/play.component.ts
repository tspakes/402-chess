import {Component, OnInit} from '@angular/core';
import {CommitTurn, LoadGetBoards, ResetBoard, UndoBoard} from '../actions/get-board.actions';
import {Store} from '@ngrx/store';
import {IAppState} from '../reducers';
import {Observable} from 'rxjs';
import {IBoardState} from '../reducers/board-reducer.reducer';
import * as moment from "moment";
import {IBoardModel} from "../models/IBoardModel";

@Component({
    selector: 'app-play',
    templateUrl: './play.component.html',
    styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit {

    board$: Observable<IBoardState> = this.store.select(state => state.board);

    public board: IBoardModel;

    public date = moment().add('30', 'seconds');

    constructor(public store: Store<IAppState>) {
    }

    public currentTeam = '';

    public updateTeam(team) {
        this.currentTeam = team;
        this.date = moment().add('31', 'seconds');
    }

    ngOnInit() {

        this.board$.subscribe((board: IBoardState) => {

            this.board = board.board;

            if (this.board !== null) {
                if (this.board.currentTeam !== this.currentTeam) {
                    this.updateTeam(this.board.currentTeam);
                }
            }
        });

        this.store.dispatch(new LoadGetBoards());

        setInterval(() => this.store.dispatch(new LoadGetBoards()), 500);
    }

    commit(team) {
        if (this.board.currentTeam === team) {
            this.store.dispatch(new CommitTurn());
        }
    }

    reset() {
        this.store.dispatch(new ResetBoard());
    }

    undo() {
        this.store.dispatch(new UndoBoard());
    }


}
