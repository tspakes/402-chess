import {Component, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {IAppState} from '../reducers';
import {CommitTurn, ResetBoard} from '../actions/get-board.actions';

@Component({
    selector: 'app-interact',
    templateUrl: './interact.component.html',
    styleUrls: ['./interact.component.scss']
})
export class InteractComponent implements OnInit {

    constructor(public store: Store<IAppState>) {
    }

    ngOnInit() {

    }

    commit() {
        this.store.dispatch(new CommitTurn());
    }

    reset() {
        this.store.dispatch(new ResetBoard());
    }

}
