import {IBoardModel} from '../models/IBoardModel';
import {GetBoardActions, GetBoardActionTypes} from '../actions/get-board.actions';


export interface IBoardState {
    board: IBoardModel;
}

export const initialState: IBoardState = {
    board: null
};


export function boardReducer(state = initialState, action: GetBoardActions): IBoardState {

    switch (action.type) {

        case GetBoardActionTypes.LoadGetBoardsSuccess:

            return {
                ...state,
                board: action.payload
            };

        case GetBoardActionTypes.PromotePieceSuccess:

            return {
                ...state,
            };

        default:
            return state;
    }
}

