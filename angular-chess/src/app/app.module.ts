import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ChessBoardComponent} from './chess-board/chess-board.component';
import {ChessPieceComponent} from './chess-piece/chess-piece.component';
import {HttpClientModule} from '@angular/common/http';
import {BoardApi} from './api/board.api';
import {ChessErrorComponent} from './chess-error/chess-error.component';
import {RemoveEmptyPipe} from './pipes/remove-empty.pipe';
import {StoreModule} from '@ngrx/store';
import {metaReducers, reducers} from './reducers';
import {EffectsModule} from '@ngrx/effects';
import {BoardEffects} from './effects/BoardEffects';
import {BsDropdownModule, ModalModule} from 'ngx-bootstrap';
import {PromotionModalComponent} from './modals/promotion/promotion.modal';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@NgModule({
    declarations: [
        AppComponent,
        ChessBoardComponent,
        ChessPieceComponent,
        ChessErrorComponent,
        RemoveEmptyPipe,
        PromotionModalComponent

    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        AppRoutingModule,
        HttpClientModule,
        StoreModule.forRoot(reducers, {metaReducers}),
        EffectsModule.forRoot([BoardEffects]),
        ModalModule.forRoot(),
        BsDropdownModule.forRoot()
    ],
    providers: [
        BoardApi
    ],
    entryComponents: [
        PromotionModalComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
