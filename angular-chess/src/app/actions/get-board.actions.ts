import {Action} from '@ngrx/store';
import {IBoardModel} from '../models/IBoardModel';
import {PieceType} from '../models/IPieceModel';

export enum GetBoardActionTypes {
    LoadGetBoards = '[GetBoard] Load GetBoards',
    LoadGetBoardsSuccess = '[GetBoard] Load GetBoards Success',
    PromotePiece = '[PromotePiece] PromotePiece',
    PromotePieceSuccess = '[PromotePiece] PromotePiece Success',
    ResetBoard = '[Board] Board Reset',
    ResetBoardSuccess = '[Board] Board Reset Success',
    CommitBoard = '[Board] CommitBoard',
    CommitBoardSuccess = '[Board] CommitBoard Success',

    ResumeBoard = '[Board] ResumeBoard',
    ResumeBoardSuccess = '[Board] ResumeBoard Success',

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


export class ResetBoard implements Action {

    readonly type = GetBoardActionTypes.ResetBoard;

    constructor() {

    }

}

export class ResetBoardSuccess implements Action {

    readonly type = GetBoardActionTypes.ResetBoardSuccess;

    constructor() {

    }

}

export class CommitTurn implements Action {

    readonly type = GetBoardActionTypes.CommitBoard;

    constructor() {

    }

}

export class CommitTurnSuccess implements Action {

    readonly type = GetBoardActionTypes.CommitBoardSuccess;

    constructor() {

    }

}

export class ResumeBoard implements Action {

    readonly type = GetBoardActionTypes.ResumeBoard;

    constructor() {

    }

}

export class ResumeBoardSuccess implements Action {

    readonly type = GetBoardActionTypes.ResumeBoardSuccess;

    constructor() {

    }

}


export type GetBoardActions =
    LoadGetBoards
    | LoadGetBoardsSuccess
    | PromotePiece
    | PromotePieceSuccess
    | ResetBoard
    | ResetBoardSuccess
    | CommitTurn
    | CommitTurnSuccess
    | ResumeBoard
    | ResumeBoardSuccess;
