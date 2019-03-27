import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {EMPTY} from 'rxjs';
import {catchError, map, mergeMap} from 'rxjs/operators';
import {BoardApi} from '../api/board.api';
import {
    CommitTurnSuccess,
    GetBoardActionTypes,
    LoadGetBoardsSuccess,
    PromotePiece,
    PromotePieceSuccess,
    ResetBoardSuccess,
    ResumeBoardSuccess,
    UndoBoardSuccess
} from '../actions/get-board.actions';
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

    @Effect()
    promotePiece$ = this.actions$
        .pipe(
            ofType(GetBoardActionTypes.PromotePiece),
            mergeMap((action: PromotePiece) => this.boardService.promote(action.payload)
                .pipe(
                    map((board: IBoardModel) => new PromotePieceSuccess()),
                    catchError(() => EMPTY)
                ))
        );

    @Effect()
    commitPiece$ = this.actions$
        .pipe(
            ofType(GetBoardActionTypes.CommitBoard),
            mergeMap(() => this.boardService.commit()
                .pipe(
                    map(() => new CommitTurnSuccess()),
                    catchError(() => EMPTY)
                ))
        );

    @Effect()
    resetBoard$ = this.actions$
        .pipe(
            ofType(GetBoardActionTypes.ResetBoard),
            mergeMap(() => this.boardService.reset()
                .pipe(
                    map(() => new ResetBoardSuccess()),
                    catchError(() => EMPTY)
                ))
        );


    @Effect()
    resumeBoard = this.actions$
        .pipe(
            ofType(GetBoardActionTypes.ResumeBoard),
            mergeMap(() => this.boardService.resume()
                .pipe(
                    map(() => new ResumeBoardSuccess()),
                    catchError(() => EMPTY)
                ))
        );

    @Effect()
    undoBoard = this.actions$
        .pipe(
            ofType(GetBoardActionTypes.UndoBoard),
            mergeMap(() => this.boardService.undo()
                .pipe(
                    map(() => new UndoBoardSuccess()),
                    catchError(() => EMPTY)
                ))
        );

    constructor(private actions$: Actions, private boardService: BoardApi) {
    }
}

