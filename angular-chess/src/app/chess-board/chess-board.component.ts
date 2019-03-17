import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {IPieceModel} from '../models/IPieceModel';

@Component({
    selector: 'app-chess-board',
    templateUrl: './chess-board.component.html',
    styleUrls: ['./chess-board.component.scss']
})
export class ChessBoardComponent implements OnChanges {

    @Input() board: any = null;
    public pieces: IPieceModel[] = [];
    private grid = [];

    onDrop(event) {

        console.log(event);

        const x = parseInt(event.target.getAttribute('x'), 10);
        const y = parseInt(event.target.getAttribute('y'), 10);

        document.getElementById(event.dataTransfer.getData('Text')).parentElement.style.setProperty('--x', ((x * 60) - 30).toString() + 'px');
        document.getElementById(event.dataTransfer.getData('Text')).parentElement.style.setProperty('--y', ((y * 60) - 30).toString() + 'px');

        console.log(document.getElementById(event.dataTransfer.getData('Text')).style);
    }

    dragOver(event) {

        event.preventDefault();
    }

    ngOnChanges(changes: SimpleChanges): void {

        if (this.board !== null) {
            this.drawBoard();
        }
    }

    trackElement(index: number, element: any) {
        return element ? element.id : null;
    }

    private drawBoard() {

        console.log(this.board);

        this.grid = this.board.pieces;

        let row_index = 1;
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
            row_index++;

        });

    }
}
