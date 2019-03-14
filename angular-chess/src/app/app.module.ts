import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ChessBoardComponent} from './chess-board/chess-board.component';
import {ChessPieceComponent} from './chess-piece/chess-piece.component';
import {HttpClientModule} from '@angular/common/http';
import {BoardApi} from './api/board.api';

@NgModule({
    declarations: [
        AppComponent,
        ChessBoardComponent,
        ChessPieceComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule
    ],
    providers: [
        BoardApi
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
