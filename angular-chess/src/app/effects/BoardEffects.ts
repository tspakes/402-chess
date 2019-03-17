import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {EMPTY} from 'rxjs';
import {catchError, map, mergeMap} from 'rxjs/operators';
import {BoardApi} from '../api/board.api';
import {GetBoardActionTypes, LoadGetBoardsSuccess} from '../actions/get-board.actions';
import {IBoardModel} from '../models/IBoardModel';

@Injectable()
export class BoardEffects {

    @Effect()
    loadBoard$ = this.actions$
        .pipe(
            ofType(GetBoardActionTypes.LoadGetBoards),
            mergeMap(() => this.boardService.getBoard()
                .pipe(
                    map((board: IBoardModel) => new LoadGetBoardsSuccess(board)),
                    catchError(() => EMPTY)
                ))
        );


    constructor(
        private actions$: Actions,
        private boardService: BoardApi
    ) {
    }
}
