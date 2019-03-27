import {ActionReducerMap, MetaReducer} from '@ngrx/store';
import {environment} from '../../environments/environment';
import {boardReducer, IBoardState} from './board-reducer.reducer';

export interface IAppState {

    board: IBoardState;
}


export const reducers: ActionReducerMap<IAppState> = {
    board: boardReducer
};


export const metaReducers: MetaReducer<IAppState>[] = !environment.production ? [] : [];
