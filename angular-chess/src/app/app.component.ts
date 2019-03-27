import {Component, OnDestroy, OnInit} from '@angular/core';
import {IPieceModel} from './models/IPieceModel';
import {Store} from '@ngrx/store';
import {Observable, Subscription} from 'rxjs';
import {LoadGetBoards} from './actions/get-board.actions';
import {IAppState} from './reducers';
import {IBoardState} from './reducers/board-reducer.reducer';
import {PromotionModalComponent} from './modals/promotion/promotion.modal';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';

@Component({
    selector: 'app-main-board',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

    title = 'angular-chess';

    public board = null;

    public pieces: IPieceModel[] = [];

    board$: Observable<IBoardState> = this.store.select(state => state.board);

    modalRef: BsModalRef = null;

    modalDescription: Subscription = null;

    constructor(public store: Store<IAppState>, private modalService: BsModalService) {
    }

    async ngOnInit() {

        this.setupModalSubscription();

        this.board$.subscribe((board: IBoardState) => {

            this.board = board.board;

            this.checkMessages();
        });

        this.store.dispatch(new LoadGetBoards());

        setInterval(() => this.store.dispatch(new LoadGetBoards()), 500);
    }

    private setupModalSubscription() {
        this.modalDescription = this.modalService.onHide.subscribe(() => {
            this.modalRef = null;
        });
    }

    private checkMessages() {

        if (this.board !== null) {
            if (this.board.message === 'PAWN_PROMOTION' && this.modalRef === null) {
                this.modalRef = this.modalService.show(PromotionModalComponent);
            } else if (this.modalRef !== null) {
                this.modalRef.hide();
                this.modalRef = null;
            }
        }
    }

    ngOnDestroy(): void {

        if (this.modalDescription !== null) {
            this.modalDescription.unsubscribe();
        }
    }
}
