import {Action} from '@ngrx/store';
import {IBoardModel} from '../models/IBoardModel';
import {PieceType} from '../models/IPieceModel';

export enum GetBoardActionTypes {
    LoadGetBoards = '[GetBoard] Load GetBoards',
    LoadGetBoardsSuccess = '[GetBoard] Load GetBoards Success',
    PromotePiece = '[PromotePiece] PromotePiece',
    PromotePieceSuccess = '[PromotePiece] PromotePiece Success',

}

export class LoadGetBoards implements Action {

    readonly type = GetBoardActionTypes.LoadGetBoards;

    constructor() {
    }

}

export class LoadGetBoardsSuccess implements Action {

    readonly type = GetBoardActionTypes.LoadGetBoardsSuccess;

    constructor(public payload: IBoardModel) {
    }

}


export class PromotePiece implements Action {

    readonly type = GetBoardActionTypes.PromotePiece;

    constructor(public payload: PieceType) {
    }

}

export class PromotePieceSuccess implements Action {

    readonly type = GetBoardActionTypes.PromotePieceSuccess;

    constructor() {

    }

}

export type GetBoardActions = LoadGetBoards | LoadGetBoardsSuccess | PromotePiece | PromotePieceSuccess;
