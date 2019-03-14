import {Component, ElementRef, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-chess-piece',
    templateUrl: './chess-piece.component.html',
    styleUrls: ['./chess-piece.component.scss']
})
export class ChessPieceComponent implements OnInit {


    /**
     * The type of piece this
     */
    @Input() type: 'rook' | 'queen' | 'king' | 'pawn' | 'knight' | 'bishop' | 'knight';

    /**
     * Which color the piece should be
     */
    @Input() color: 'black' | 'white';


    @Input() x: number;

    @Input() y: number;

    @Input() chessId: string;

    constructor(public elementRef: ElementRef) {
    }

    ngOnInit() {


        this.elementRef.nativeElement.style.setProperty('--chess-background', 'url(\'/assets/pieces/' + this.type + '_' + this.color + '.png\')');

        this.setCoordinates();

    }

    private setCoordinates() {

        this.elementRef.nativeElement.style.setProperty('--x', ((this.x * 60) - 30) + 'px');
        this.elementRef.nativeElement.style.setProperty('--y', ((this.y * 60) - 30) + 'px');
    }


    dragStart(event) {
        console.log(this.chessId);
        event.dataTransfer.setData('Text', this.chessId);

    }

}

