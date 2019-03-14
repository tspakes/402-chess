import {Component} from '@angular/core';

@Component({
    selector: 'app-chess-board',
    templateUrl: './chess-board.component.html',
    styleUrls: ['./chess-board.component.scss']
})
export class ChessBoardComponent {


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
}
