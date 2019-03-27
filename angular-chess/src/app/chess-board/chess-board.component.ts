import {Component, ElementRef, Input} from '@angular/core';
import {IPieceModel} from '../models/IPieceModel';
import {PromotionModalComponent} from '../modals/promotion/promotion.modal';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {Store} from "@ngrx/store";
import {IAppState} from "../reducers";
import {CommitTurn, ResetBoard} from "../actions/get-board.actions";

@Component({
    selector: 'app-chess-board',
    templateUrl: './chess-board.component.html',
    styleUrls: ['./chess-board.component.scss']
})
export class ChessBoardComponent {

    @Input() board: any = null;
    public pieces: IPieceModel[] = [];
    private grid = [];

    modalRef: BsModalRef;

    constructor(public elementRef: ElementRef,
                private modalService: BsModalService,
                public store: Store<IAppState>) {
    }

    onDrop(event) {

        const x = parseInt(event.target.getAttribute('x'), 10);
        const y = parseInt(event.target.getAttribute('y'), 10);

        const dropTarget = document.getElementById(event.dataTransfer.getData('Text')).parentElement.style;
        dropTarget.setProperty('--x', ((x * 60) - 30).toString() + 'px');
        dropTarget.setProperty('--y', ((y * 60) - 30).toString() + 'px');

        console.log(document.getElementById(event.dataTransfer.getData('Text')).style);
    }

    dragOver(event) {

        event.preventDefault();
    }


    trackElement(index: number, element: any) {

        return element.id;
    }

    public get getGrid() {

        if (this.board !== null) {

            this.grid = this.board.pieces;

            let row_index = 8;
            let column_index = 1;

            this.grid.forEach((row: Array<any>) => {

                row.forEach((piece: IPieceModel) => {

                    if (piece !== null) {

                        piece.column = column_index;
                        piece.row = row_index;

                    }

                    column_index++;

                });

                // Reset the column index every time we enter into a new row
                column_index = 1;
                row_index--;

            });
        }

        return this.grid;

    }

    promote(piece: IPieceModel) {

        if (piece.type === 'pawn') {
            this.modalRef = this.modalService.show(PromotionModalComponent, {
                initialState: {
                    initialPiece: piece
                }
            });
        }
    }

    commit() {
        this.store.dispatch(new CommitTurn());
    }

    reset() {
        this.store.dispatch(new ResetBoard());
    }
}
