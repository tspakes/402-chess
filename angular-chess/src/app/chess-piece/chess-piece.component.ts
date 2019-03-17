import {Component, DoCheck, ElementRef, Input, OnInit} from '@angular/core';
import {IPieceModel} from '../models/IPieceModel';

@Component({
    selector: 'app-chess-piece',
    templateUrl: './chess-piece.component.html',
    styleUrls: ['./chess-piece.component.scss']
})
export class ChessPieceComponent implements OnInit, DoCheck {


    @Input() piece: IPieceModel;


    constructor(public elementRef: ElementRef) {
    }

    ngOnInit() {
        this.draw();
    }

    dragStart(event) {

        event.dataTransfer.setData('Text', this.piece.id.toString());

    }

    // Draw on every check
    ngDoCheck() {
        this.draw();
    }

    private draw() {

        const background_property = 'url(\'/assets/pieces/' + this.piece.type + '_' + this.piece.team + '.png\')';
        this.elementRef.nativeElement.style.setProperty('--chess-background', background_property);

        this.setCoordinates();

    }

    private setCoordinates() {

        this.elementRef.nativeElement.style.setProperty('--x', ((this.piece.column * 60) - 30) + 'px');
        this.elementRef.nativeElement.style.setProperty('--y', ((this.piece.row * 60) - 30) + 'px');
    }

}



