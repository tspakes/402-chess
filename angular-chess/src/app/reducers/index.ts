import {ActionReducerMap, MetaReducer} from '@ngrx/store';
import {environment} from '../../environments/environment';
import {boardReducer} from './board-reducer.reducer';

export interface State {
}


export const reducers: ActionReducerMap<State> = {
    board: boardReducer
};


export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
