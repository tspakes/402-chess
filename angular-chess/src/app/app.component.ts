import {Component, OnInit} from '@angular/core';
import {BoardApi} from './api/board.api';
import {PieceModel} from './models/piece.model';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    title = 'angular-chess';

    public board = [];

    public pieces: PieceModel[] = [];

    constructor(private boardApi: BoardApi) {
    }

    async ngOnInit() {


        this.board = await this.boardApi.getBoard();
        this.drawBoard();

        setInterval(async () => {

            this.board = await this.boardApi.getBoard();
            this.drawBoard();

        }, 2000);
    }

    private drawBoard() {

        this.pieces  = [];

        let row_index = 1;
        let column_index = 1;

        this.board.forEach((row: Array<any>) => {

            row.forEach((piece: PieceModel) => {

                if (piece !== null) {
                    piece.column = column_index;
                    piece.row = row_index;
                    this.pieces.push(piece);
                }

                column_index++;

            });

            // Reset the column index every time we enter into a new row
            column_index = 1;
            row_index++;

        });
    }
}
