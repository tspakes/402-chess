import {Component} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap';
import {IPieceModel} from '../../models/IPieceModel';
import {Store} from '@ngrx/store';
import {IAppState} from '../../reducers';
import {PromotePiece} from '../../actions/get-board.actions';
import {BoardApi} from '../../api/board.api';

@Component({
    selector: 'app-promotion-modal',
    templateUrl: './promotion.html'
})
export class PromotionModalComponent {

    choosePromotion(piece: IPieceModel) {

        this.store.dispatch(new PromotePiece(piece.type));

        this.boardApi.resume();

        this.bsModalRef.hide();
    }

    get getTeam() {

        return 'black';
    }

    get pieceTypes() {

        return [
            {
                team: this.getTeam,
                type: 'bishop'
            },
            {
                team: this.getTeam,
                type: 'queen'
            },
            {
                team: this.getTeam,
                type: 'rook'
            },
            {
                team: this.getTeam,
                type: 'knight'
            }
        ];
    }

    constructor(public bsModalRef: BsModalRef, public store: Store<IAppState>, private boardApi: BoardApi) {
    }

}
