import {Action} from '@ngrx/store';
import {IBoardModel} from "../models/IBoardModel";

export enum GetBoardActionTypes {
    LoadGetBoards = '[GetBoard] Load GetBoards',
    LoadGetBoardsSuccess = '[GetBoard] Load GetBoards Success',

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


export type GetBoardActions = LoadGetBoards | LoadGetBoardsSuccess;
