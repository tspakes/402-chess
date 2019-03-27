(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "./src/$$_lazy_route_resource lazy recursive":
/*!**********************************************************!*\
  !*** ./src/$$_lazy_route_resource lazy namespace object ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "./src/$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "./src/app/actions/get-board.actions.ts":
/*!**********************************************!*\
  !*** ./src/app/actions/get-board.actions.ts ***!
  \**********************************************/
/*! exports provided: GetBoardActionTypes, LoadGetBoards, LoadGetBoardsSuccess, PromotePiece, PromotePieceSuccess, ResetBoard, ResetBoardSuccess, CommitTurn, CommitTurnSuccess */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GetBoardActionTypes", function() { return GetBoardActionTypes; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LoadGetBoards", function() { return LoadGetBoards; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LoadGetBoardsSuccess", function() { return LoadGetBoardsSuccess; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PromotePiece", function() { return PromotePiece; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PromotePieceSuccess", function() { return PromotePieceSuccess; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ResetBoard", function() { return ResetBoard; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ResetBoardSuccess", function() { return ResetBoardSuccess; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CommitTurn", function() { return CommitTurn; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CommitTurnSuccess", function() { return CommitTurnSuccess; });
var GetBoardActionTypes;
(function (GetBoardActionTypes) {
    GetBoardActionTypes["LoadGetBoards"] = "[GetBoard] Load GetBoards";
    GetBoardActionTypes["LoadGetBoardsSuccess"] = "[GetBoard] Load GetBoards Success";
    GetBoardActionTypes["PromotePiece"] = "[PromotePiece] PromotePiece";
    GetBoardActionTypes["PromotePieceSuccess"] = "[PromotePiece] PromotePiece Success";
    GetBoardActionTypes["ResetBoard"] = "[Board] Board Reset";
    GetBoardActionTypes["ResetBoardSuccess"] = "[Board] Board Reset Success";
    GetBoardActionTypes["CommitBoard"] = "[Board] CommitBoard";
    GetBoardActionTypes["CommitBoardSuccess"] = "[Board] CommitBoard Success";
})(GetBoardActionTypes || (GetBoardActionTypes = {}));
var LoadGetBoards = /** @class */ (function () {
    function LoadGetBoards() {
        this.type = GetBoardActionTypes.LoadGetBoards;
    }
    return LoadGetBoards;
}());

var LoadGetBoardsSuccess = /** @class */ (function () {
    function LoadGetBoardsSuccess(payload) {
        this.payload = payload;
        this.type = GetBoardActionTypes.LoadGetBoardsSuccess;
    }
    return LoadGetBoardsSuccess;
}());

var PromotePiece = /** @class */ (function () {
    function PromotePiece(payload) {
        this.payload = payload;
        this.type = GetBoardActionTypes.PromotePiece;
    }
    return PromotePiece;
}());

var PromotePieceSuccess = /** @class */ (function () {
    function PromotePieceSuccess() {
        this.type = GetBoardActionTypes.PromotePieceSuccess;
    }
    return PromotePieceSuccess;
}());

var ResetBoard = /** @class */ (function () {
    function ResetBoard() {
        this.type = GetBoardActionTypes.ResetBoard;
    }
    return ResetBoard;
}());

var ResetBoardSuccess = /** @class */ (function () {
    function ResetBoardSuccess() {
        this.type = GetBoardActionTypes.ResetBoardSuccess;
    }
    return ResetBoardSuccess;
}());

var CommitTurn = /** @class */ (function () {
    function CommitTurn() {
        this.type = GetBoardActionTypes.CommitBoard;
    }
    return CommitTurn;
}());

var CommitTurnSuccess = /** @class */ (function () {
    function CommitTurnSuccess() {
        this.type = GetBoardActionTypes.CommitBoardSuccess;
    }
    return CommitTurnSuccess;
}());



/***/ }),

/***/ "./src/app/api/board.api.ts":
/*!**********************************!*\
  !*** ./src/app/api/board.api.ts ***!
  \**********************************/
/*! exports provided: BoardApi */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BoardApi", function() { return BoardApi; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");



var BoardApi = /** @class */ (function () {
    function BoardApi(httpClient) {
        this.httpClient = httpClient;
        this.endpoint = window.location.href.substr(0, window.location.href.lastIndexOf('/'));
    }
    BoardApi.prototype.getBoard = function () {
        return this.httpClient.get(this.endpoint + "/board");
    };
    BoardApi.prototype.resume = function () {
        return this.httpClient.post(this.endpoint + "/board/resume", {}).toPromise();
    };
    BoardApi.prototype.commit = function () {
        return this.httpClient.post(this.endpoint + "/board/commit", {});
    };
    BoardApi.prototype.reset = function () {
        return this.httpClient.post(this.endpoint + "/board/reset", {});
    };
    BoardApi.prototype.promote = function (type) {
        return this.httpClient.post(this.endpoint + "/board/promote/" + type, {});
    };
    BoardApi = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Injectable"])({
            providedIn: 'root'
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"]])
    ], BoardApi);
    return BoardApi;
}());



/***/ }),

/***/ "./src/app/app-routing.module.ts":
/*!***************************************!*\
  !*** ./src/app/app-routing.module.ts ***!
  \***************************************/
/*! exports provided: AppRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppRoutingModule", function() { return AppRoutingModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app.component */ "./src/app/app.component.ts");
/* harmony import */ var _interact_interact_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./interact/interact.component */ "./src/app/interact/interact.component.ts");





var routes = [
    {
        path: '', component: _app_component__WEBPACK_IMPORTED_MODULE_3__["AppComponent"],
    },
    {
        path: 'interact', component: _interact_interact_component__WEBPACK_IMPORTED_MODULE_4__["InteractComponent"],
    }
];
var AppRoutingModule = /** @class */ (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            imports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"].forRoot(routes)],
            exports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"]]
        })
    ], AppRoutingModule);
    return AppRoutingModule;
}());



/***/ }),

/***/ "./src/app/app.component.html":
/*!************************************!*\
  !*** ./src/app/app.component.html ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div>\r\n    <app-chess-board [board]=\"board\"></app-chess-board>\r\n</div>\r\n"

/***/ }),

/***/ "./src/app/app.component.scss":
/*!************************************!*\
  !*** ./src/app/app.component.scss ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2FwcC5jb21wb25lbnQuc2NzcyJ9 */"

/***/ }),

/***/ "./src/app/app.component.ts":
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ngrx/store */ "./node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _actions_get_board_actions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./actions/get-board.actions */ "./src/app/actions/get-board.actions.ts");
/* harmony import */ var _modals_promotion_promotion_modal__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./modals/promotion/promotion.modal */ "./src/app/modals/promotion/promotion.modal.ts");
/* harmony import */ var ngx_bootstrap__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ngx-bootstrap */ "./node_modules/ngx-bootstrap/esm5/ngx-bootstrap.js");






var AppComponent = /** @class */ (function () {
    function AppComponent(store, modalService) {
        this.store = store;
        this.modalService = modalService;
        this.title = 'angular-chess';
        this.board = null;
        this.pieces = [];
        this.board$ = this.store.select(function (state) { return state.board; });
        this.modalRef = null;
        this.modalDescription = null;
    }
    AppComponent.prototype.ngOnInit = function () {
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function () {
            var _this = this;
            return tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"](this, function (_a) {
                this.setupModalSubscription();
                this.board$.subscribe(function (board) {
                    _this.board = board.board;
                    _this.checkMessages();
                });
                this.store.dispatch(new _actions_get_board_actions__WEBPACK_IMPORTED_MODULE_3__["LoadGetBoards"]());
                setInterval(function () { return _this.store.dispatch(new _actions_get_board_actions__WEBPACK_IMPORTED_MODULE_3__["LoadGetBoards"]()); }, 500);
                return [2 /*return*/];
            });
        });
    };
    AppComponent.prototype.setupModalSubscription = function () {
        var _this = this;
        this.modalDescription = this.modalService.onHide.subscribe(function () {
            _this.modalRef = null;
        });
    };
    AppComponent.prototype.checkMessages = function () {
        if (this.board !== null) {
            if (this.board.message === 'PAWN_PROMOTION' && this.modalRef === null) {
                this.modalRef = this.modalService.show(_modals_promotion_promotion_modal__WEBPACK_IMPORTED_MODULE_4__["PromotionModalComponent"]);
            }
            else if (this.modalRef !== null) {
                this.modalRef.hide();
                this.modalRef = null;
            }
        }
    };
    AppComponent.prototype.ngOnDestroy = function () {
        if (this.modalDescription !== null) {
            this.modalDescription.unsubscribe();
        }
    };
    AppComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-main-board',
            template: __webpack_require__(/*! ./app.component.html */ "./src/app/app.component.html"),
            styles: [__webpack_require__(/*! ./app.component.scss */ "./src/app/app.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_2__["Store"], ngx_bootstrap__WEBPACK_IMPORTED_MODULE_5__["BsModalService"]])
    ], AppComponent);
    return AppComponent;
}());



/***/ }),

/***/ "./src/app/app.module.ts":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _app_routing_module__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app-routing.module */ "./src/app/app-routing.module.ts");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./app.component */ "./src/app/app.component.ts");
/* harmony import */ var _chess_board_chess_board_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./chess-board/chess-board.component */ "./src/app/chess-board/chess-board.component.ts");
/* harmony import */ var _chess_piece_chess_piece_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./chess-piece/chess-piece.component */ "./src/app/chess-piece/chess-piece.component.ts");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _api_board_api__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./api/board.api */ "./src/app/api/board.api.ts");
/* harmony import */ var _chess_error_chess_error_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./chess-error/chess-error.component */ "./src/app/chess-error/chess-error.component.ts");
/* harmony import */ var _pipes_remove_empty_pipe__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./pipes/remove-empty.pipe */ "./src/app/pipes/remove-empty.pipe.ts");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @ngrx/store */ "./node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _reducers__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./reducers */ "./src/app/reducers/index.ts");
/* harmony import */ var _ngrx_effects__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @ngrx/effects */ "./node_modules/@ngrx/effects/fesm5/effects.js");
/* harmony import */ var _effects_BoardEffects__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./effects/BoardEffects */ "./src/app/effects/BoardEffects.ts");
/* harmony import */ var ngx_bootstrap__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ngx-bootstrap */ "./node_modules/ngx-bootstrap/esm5/ngx-bootstrap.js");
/* harmony import */ var _modals_promotion_promotion_modal__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./modals/promotion/promotion.modal */ "./src/app/modals/promotion/promotion.modal.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _interact_interact_component__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./interact/interact.component */ "./src/app/interact/interact.component.ts");
/* harmony import */ var _main_main_component__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./main/main.component */ "./src/app/main/main.component.ts");




















var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["NgModule"])({
            declarations: [
                _app_component__WEBPACK_IMPORTED_MODULE_4__["AppComponent"],
                _chess_board_chess_board_component__WEBPACK_IMPORTED_MODULE_5__["ChessBoardComponent"],
                _chess_piece_chess_piece_component__WEBPACK_IMPORTED_MODULE_6__["ChessPieceComponent"],
                _chess_error_chess_error_component__WEBPACK_IMPORTED_MODULE_9__["ChessErrorComponent"],
                _pipes_remove_empty_pipe__WEBPACK_IMPORTED_MODULE_10__["RemoveEmptyPipe"],
                _modals_promotion_promotion_modal__WEBPACK_IMPORTED_MODULE_16__["PromotionModalComponent"],
                _interact_interact_component__WEBPACK_IMPORTED_MODULE_18__["InteractComponent"],
                _main_main_component__WEBPACK_IMPORTED_MODULE_19__["MainComponent"]
            ],
            imports: [
                _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__["BrowserModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_17__["FormsModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_17__["ReactiveFormsModule"],
                _app_routing_module__WEBPACK_IMPORTED_MODULE_3__["AppRoutingModule"],
                _angular_common_http__WEBPACK_IMPORTED_MODULE_7__["HttpClientModule"],
                _ngrx_store__WEBPACK_IMPORTED_MODULE_11__["StoreModule"].forRoot(_reducers__WEBPACK_IMPORTED_MODULE_12__["reducers"], { metaReducers: _reducers__WEBPACK_IMPORTED_MODULE_12__["metaReducers"] }),
                _ngrx_effects__WEBPACK_IMPORTED_MODULE_13__["EffectsModule"].forRoot([_effects_BoardEffects__WEBPACK_IMPORTED_MODULE_14__["BoardEffects"]]),
                ngx_bootstrap__WEBPACK_IMPORTED_MODULE_15__["ModalModule"].forRoot(),
                ngx_bootstrap__WEBPACK_IMPORTED_MODULE_15__["BsDropdownModule"].forRoot()
            ],
            providers: [
                _api_board_api__WEBPACK_IMPORTED_MODULE_8__["BoardApi"]
            ],
            entryComponents: [
                _modals_promotion_promotion_modal__WEBPACK_IMPORTED_MODULE_16__["PromotionModalComponent"]
            ],
            bootstrap: [_main_main_component__WEBPACK_IMPORTED_MODULE_19__["MainComponent"]]
        })
    ], AppModule);
    return AppModule;
}());



/***/ }),

/***/ "./src/app/chess-board/chess-board.component.html":
/*!********************************************************!*\
  !*** ./src/app/chess-board/chess-board.component.html ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div>\r\n\r\n    <app-chess-error [board]=\"board\"></app-chess-error>\r\n\r\n\r\n    <div class=\"row mb-2 justify-content-center\">\r\n        <div class=\"col-auto\">\r\n            <button type=\"button\" class=\"btn btn-success\" (click)=\"commit()\">Commit</button>\r\n\r\n\r\n        </div>\r\n        <div class=\"col-auto\">\r\n            <button type=\"button\" class=\"btn btn-danger\" (click)=\"reset()\">\r\n                Reset\r\n            </button>\r\n        </div>\r\n    </div>\r\n\r\n    <table (dragover)=\"dragOver($event)\" (drop)=\"onDrop($event)\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\">\r\n        <app-chess-piece *ngFor=\"let piece of getGrid | removeEmpty; trackBy: trackElement\"\r\n                         [piece]=\"piece\" (dblclick)=\"promote(piece)\">\r\n\r\n        </app-chess-piece>\r\n        <tr>\r\n            <td x=\"1\" y=\"1\"></td>\r\n            <td x=\"2\" y=\"1\"></td>\r\n            <td x=\"3\" y=\"1\"></td>\r\n            <td x=\"4\" y=\"1\"></td>\r\n            <td x=\"5\" y=\"1\"></td>\r\n            <td x=\"6\" y=\"1\"></td>\r\n            <td x=\"7\" y=\"1\"></td>\r\n            <td x=\"8\" y=\"1\"></td>\r\n        </tr>\r\n        <tr>\r\n            <td x=\"1\" y=\"2\"></td>\r\n            <td x=\"2\" y=\"2\"></td>\r\n            <td x=\"3\" y=\"2\"></td>\r\n            <td x=\"4\" y=\"2\"></td>\r\n            <td x=\"5\" y=\"2\"></td>\r\n            <td x=\"6\" y=\"2\"></td>\r\n            <td x=\"7\" y=\"2\"></td>\r\n            <td x=\"8\" y=\"2\"></td>\r\n        </tr>\r\n        <tr>\r\n            <td x=\"1\" y=\"3\"></td>\r\n            <td x=\"2\" y=\"3\"></td>\r\n            <td x=\"3\" y=\"3\"></td>\r\n            <td x=\"4\" y=\"3\"></td>\r\n            <td x=\"5\" y=\"3\"></td>\r\n            <td x=\"6\" y=\"3\"></td>\r\n            <td x=\"7\" y=\"3\"></td>\r\n            <td x=\"8\" y=\"3\"></td>\r\n        </tr>\r\n        <tr>\r\n            <td x=\"1\" y=\"4\"></td>\r\n            <td x=\"2\" y=\"4\"></td>\r\n            <td x=\"3\" y=\"4\"></td>\r\n            <td x=\"4\" y=\"4\"></td>\r\n            <td x=\"5\" y=\"4\"></td>\r\n            <td x=\"6\" y=\"4\"></td>\r\n            <td x=\"7\" y=\"4\"></td>\r\n            <td x=\"8\" y=\"4\"></td>\r\n        </tr>\r\n        <tr>\r\n            <td x=\"1\" y=\"5\"></td>\r\n            <td x=\"2\" y=\"5\"></td>\r\n            <td x=\"3\" y=\"5\"></td>\r\n            <td x=\"4\" y=\"5\"></td>\r\n            <td x=\"5\" y=\"5\"></td>\r\n            <td x=\"6\" y=\"5\"></td>\r\n            <td x=\"7\" y=\"5\"></td>\r\n            <td x=\"8\" y=\"5\"></td>\r\n        </tr>\r\n        <tr>\r\n            <td x=\"1\" y=\"6\"></td>\r\n            <td x=\"2\" y=\"6\"></td>\r\n            <td x=\"3\" y=\"6\"></td>\r\n            <td x=\"4\" y=\"6\"></td>\r\n            <td x=\"5\" y=\"6\"></td>\r\n            <td x=\"6\" y=\"6\"></td>\r\n            <td x=\"7\" y=\"6\"></td>\r\n            <td x=\"8\" y=\"6\"></td>\r\n        </tr>\r\n        <tr>\r\n            <td x=\"1\" y=\"7\"></td>\r\n            <td x=\"2\" y=\"7\"></td>\r\n            <td x=\"3\" y=\"7\"></td>\r\n            <td x=\"4\" y=\"7\"></td>\r\n            <td x=\"5\" y=\"7\"></td>\r\n            <td x=\"6\" y=\"7\"></td>\r\n            <td x=\"7\" y=\"7\"></td>\r\n            <td x=\"8\" y=\"7\"></td>\r\n        </tr>\r\n        <tr>\r\n            <td x=\"1\" y=\"8\"></td>\r\n            <td x=\"2\" y=\"8\"></td>\r\n            <td x=\"3\" y=\"8\"></td>\r\n            <td x=\"4\" y=\"8\"></td>\r\n            <td x=\"5\" y=\"8\"></td>\r\n            <td x=\"6\" y=\"8\"></td>\r\n            <td x=\"7\" y=\"8\"></td>\r\n            <td x=\"8\" y=\"8\"></td>\r\n        </tr>\r\n    </table>\r\n</div>\r\n"

/***/ }),

/***/ "./src/app/chess-board/chess-board.component.scss":
/*!********************************************************!*\
  !*** ./src/app/chess-board/chess-board.component.scss ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "table {\n  background: #6F5134;\n  margin: 0;\n  border: solid 10px #6f5134;\n  display: block;\n  position: relative;\n  height: 480px;\n  width: 480px; }\n\ntd {\n  width: 60px;\n  height: 60px;\n  margin: 0;\n  padding: 0; }\n\ntr {\n  padding: 0;\n  margin: 0; }\n\ntr:nth-child(odd) td:nth-child(even), tr:nth-child(even) td:nth-child(odd) {\n  background-image: url(\"/assets/squares/light.png\");\n  background-size: contain; }\n\ntr:nth-child(even) td:nth-child(even), tr:nth-child(odd) td:nth-child(odd) {\n  background-image: url(\"/assets/squares/dark.png\");\n  background-size: contain; }\n\n:host {\n  position: relative;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100vh;\n  width: 100vw;\n  background: #e9d6aa; }\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvY2hlc3MtYm9hcmQvQzpcXFVzZXJzXFxic2VyZ2VudFxcRG9jdW1lbnRzXFxTb3VyY2VcXDQwMmNoZXNzXFxhbmd1bGFyLWNoZXNzL3NyY1xcYXBwXFxjaGVzcy1ib2FyZFxcY2hlc3MtYm9hcmQuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSxvQkFBbUI7RUFDbkIsVUFBUztFQUNULDJCQUEwQjtFQUMxQixlQUFjO0VBQ2QsbUJBQWtCO0VBQ2xCLGNBQWE7RUFDYixhQUFZLEVBQ2I7O0FBRUQ7RUFDRSxZQUFXO0VBQ1gsYUFBWTtFQUNaLFVBQVM7RUFDVCxXQUFVLEVBRVg7O0FBRUQ7RUFDRSxXQUFVO0VBQ1YsVUFBUyxFQUNWOztBQUVEO0VBQ0UsbURBQWtEO0VBQ2xELHlCQUF3QixFQUV6Qjs7QUFFRDtFQUNFLGtEQUFpRDtFQUNqRCx5QkFBd0IsRUFFekI7O0FBR0Q7RUFDRSxtQkFBa0I7RUFDbEIsY0FBYTtFQUNiLHdCQUF1QjtFQUN2QixvQkFBbUI7RUFDbkIsY0FBYTtFQUNiLGFBQVk7RUFDWixvQkFBbUIsRUFDcEIiLCJmaWxlIjoic3JjL2FwcC9jaGVzcy1ib2FyZC9jaGVzcy1ib2FyZC5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbInRhYmxlIHtcclxuICBiYWNrZ3JvdW5kOiAjNkY1MTM0O1xyXG4gIG1hcmdpbjogMDtcclxuICBib3JkZXI6IHNvbGlkIDEwcHggIzZmNTEzNDtcclxuICBkaXNwbGF5OiBibG9jaztcclxuICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgaGVpZ2h0OiA0ODBweDtcclxuICB3aWR0aDogNDgwcHg7XHJcbn1cclxuXHJcbnRkIHtcclxuICB3aWR0aDogNjBweDtcclxuICBoZWlnaHQ6IDYwcHg7XHJcbiAgbWFyZ2luOiAwO1xyXG4gIHBhZGRpbmc6IDA7XHJcblxyXG59XHJcblxyXG50ciB7XHJcbiAgcGFkZGluZzogMDtcclxuICBtYXJnaW46IDA7XHJcbn1cclxuXHJcbnRyOm50aC1jaGlsZChvZGQpIHRkOm50aC1jaGlsZChldmVuKSwgdHI6bnRoLWNoaWxkKGV2ZW4pIHRkOm50aC1jaGlsZChvZGQpIHtcclxuICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoXCIvYXNzZXRzL3NxdWFyZXMvbGlnaHQucG5nXCIpO1xyXG4gIGJhY2tncm91bmQtc2l6ZTogY29udGFpbjtcclxuXHJcbn1cclxuXHJcbnRyOm50aC1jaGlsZChldmVuKSB0ZDpudGgtY2hpbGQoZXZlbiksIHRyOm50aC1jaGlsZChvZGQpIHRkOm50aC1jaGlsZChvZGQpIHtcclxuICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoXCIvYXNzZXRzL3NxdWFyZXMvZGFyay5wbmdcIik7XHJcbiAgYmFja2dyb3VuZC1zaXplOiBjb250YWluO1xyXG5cclxufVxyXG5cclxuXHJcbjpob3N0IHtcclxuICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgZGlzcGxheTogZmxleDtcclxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcclxuICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gIGhlaWdodDogMTAwdmg7XHJcbiAgd2lkdGg6IDEwMHZ3O1xyXG4gIGJhY2tncm91bmQ6ICNlOWQ2YWE7XHJcbn1cclxuIl19 */"

/***/ }),

/***/ "./src/app/chess-board/chess-board.component.ts":
/*!******************************************************!*\
  !*** ./src/app/chess-board/chess-board.component.ts ***!
  \******************************************************/
/*! exports provided: ChessBoardComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ChessBoardComponent", function() { return ChessBoardComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _modals_promotion_promotion_modal__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../modals/promotion/promotion.modal */ "./src/app/modals/promotion/promotion.modal.ts");
/* harmony import */ var ngx_bootstrap__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ngx-bootstrap */ "./node_modules/ngx-bootstrap/esm5/ngx-bootstrap.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ngrx/store */ "./node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _actions_get_board_actions__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../actions/get-board.actions */ "./src/app/actions/get-board.actions.ts");






var ChessBoardComponent = /** @class */ (function () {
    function ChessBoardComponent(elementRef, modalService, store) {
        this.elementRef = elementRef;
        this.modalService = modalService;
        this.store = store;
        this.board = null;
        this.pieces = [];
        this.grid = [];
    }
    ChessBoardComponent.prototype.onDrop = function (event) {
        var x = parseInt(event.target.getAttribute('x'), 10);
        var y = parseInt(event.target.getAttribute('y'), 10);
        var dropTarget = document.getElementById(event.dataTransfer.getData('Text')).parentElement.style;
        dropTarget.setProperty('--x', ((x * 60) - 30).toString() + 'px');
        dropTarget.setProperty('--y', ((y * 60) - 30).toString() + 'px');
        console.log(document.getElementById(event.dataTransfer.getData('Text')).style);
    };
    ChessBoardComponent.prototype.dragOver = function (event) {
        event.preventDefault();
    };
    ChessBoardComponent.prototype.trackElement = function (index, element) {
        return element.id;
    };
    Object.defineProperty(ChessBoardComponent.prototype, "getGrid", {
        get: function () {
            if (this.board !== null) {
                this.grid = this.board.pieces;
                var row_index_1 = 8;
                var column_index_1 = 1;
                this.grid.forEach(function (row) {
                    row.forEach(function (piece) {
                        if (piece !== null) {
                            piece.column = column_index_1;
                            piece.row = row_index_1;
                        }
                        column_index_1++;
                    });
                    // Reset the column index every time we enter into a new row
                    column_index_1 = 1;
                    row_index_1--;
                });
            }
            return this.grid;
        },
        enumerable: true,
        configurable: true
    });
    ChessBoardComponent.prototype.promote = function (piece) {
        if (piece.type === 'pawn') {
            this.modalRef = this.modalService.show(_modals_promotion_promotion_modal__WEBPACK_IMPORTED_MODULE_2__["PromotionModalComponent"], {
                initialState: {
                    initialPiece: piece
                }
            });
        }
    };
    ChessBoardComponent.prototype.commit = function () {
        this.store.dispatch(new _actions_get_board_actions__WEBPACK_IMPORTED_MODULE_5__["CommitTurn"]());
    };
    ChessBoardComponent.prototype.reset = function () {
        this.store.dispatch(new _actions_get_board_actions__WEBPACK_IMPORTED_MODULE_5__["ResetBoard"]());
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], ChessBoardComponent.prototype, "board", void 0);
    ChessBoardComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-chess-board',
            template: __webpack_require__(/*! ./chess-board.component.html */ "./src/app/chess-board/chess-board.component.html"),
            styles: [__webpack_require__(/*! ./chess-board.component.scss */ "./src/app/chess-board/chess-board.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"],
            ngx_bootstrap__WEBPACK_IMPORTED_MODULE_3__["BsModalService"],
            _ngrx_store__WEBPACK_IMPORTED_MODULE_4__["Store"]])
    ], ChessBoardComponent);
    return ChessBoardComponent;
}());



/***/ }),

/***/ "./src/app/chess-error/chess-error.component.html":
/*!********************************************************!*\
  !*** ./src/app/chess-error/chess-error.component.html ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div *ngIf=\"board?.message.length > 0\" class=\"error\">\r\n    <span>{{board?.description}}</span>\r\n\r\n    <button (click)=\"resume()\" class=\"resume-game\">Resume Game</button>\r\n</div>\r\n"

/***/ }),

/***/ "./src/app/chess-error/chess-error.component.scss":
/*!********************************************************!*\
  !*** ./src/app/chess-error/chess-error.component.scss ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".error {\n  display: flex;\n  flex-direction: row;\n  padding: 10px;\n  background: white;\n  justify-content: space-between;\n  align-items: center;\n  border-radius: 3px;\n  margin-bottom: 10px; }\n\n.error > span {\n  color: red;\n  margin-right: 5px; }\n\n.resume-game {\n  border: none;\n  color: white;\n  background: forestgreen;\n  padding: 10px;\n  border-radius: 3px; }\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvY2hlc3MtZXJyb3IvQzpcXFVzZXJzXFxic2VyZ2VudFxcRG9jdW1lbnRzXFxTb3VyY2VcXDQwMmNoZXNzXFxhbmd1bGFyLWNoZXNzL3NyY1xcYXBwXFxjaGVzcy1lcnJvclxcY2hlc3MtZXJyb3IuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0E7RUFDRSxjQUFhO0VBQ2Isb0JBQW1CO0VBQ25CLGNBQWE7RUFDYixrQkFBaUI7RUFDakIsK0JBQThCO0VBQzlCLG9CQUFtQjtFQUNuQixtQkFBa0I7RUFDbEIsb0JBQW1CLEVBRXBCOztBQUdEO0VBQ0UsV0FBVTtFQUNWLGtCQUFpQixFQUNsQjs7QUFFRDtFQUNFLGFBQVk7RUFDWixhQUFZO0VBQ1osd0JBQXVCO0VBQ3ZCLGNBQWE7RUFDYixtQkFBa0IsRUFDbkIiLCJmaWxlIjoic3JjL2FwcC9jaGVzcy1lcnJvci9jaGVzcy1lcnJvci5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG4uZXJyb3Ige1xyXG4gIGRpc3BsYXk6IGZsZXg7XHJcbiAgZmxleC1kaXJlY3Rpb246IHJvdztcclxuICBwYWRkaW5nOiAxMHB4O1xyXG4gIGJhY2tncm91bmQ6IHdoaXRlO1xyXG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcclxuICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gIGJvcmRlci1yYWRpdXM6IDNweDtcclxuICBtYXJnaW4tYm90dG9tOiAxMHB4O1xyXG5cclxufVxyXG5cclxuXHJcbi5lcnJvciA+IHNwYW4ge1xyXG4gIGNvbG9yOiByZWQ7XHJcbiAgbWFyZ2luLXJpZ2h0OiA1cHg7XHJcbn1cclxuXHJcbi5yZXN1bWUtZ2FtZSB7XHJcbiAgYm9yZGVyOiBub25lO1xyXG4gIGNvbG9yOiB3aGl0ZTtcclxuICBiYWNrZ3JvdW5kOiBmb3Jlc3RncmVlbjtcclxuICBwYWRkaW5nOiAxMHB4O1xyXG4gIGJvcmRlci1yYWRpdXM6IDNweDtcclxufVxyXG4iXX0= */"

/***/ }),

/***/ "./src/app/chess-error/chess-error.component.ts":
/*!******************************************************!*\
  !*** ./src/app/chess-error/chess-error.component.ts ***!
  \******************************************************/
/*! exports provided: ChessErrorComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ChessErrorComponent", function() { return ChessErrorComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _api_board_api__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../api/board.api */ "./src/app/api/board.api.ts");



var ChessErrorComponent = /** @class */ (function () {
    function ChessErrorComponent(boardApi) {
        this.boardApi = boardApi;
        this.board = null;
    }
    ChessErrorComponent.prototype.ngOnInit = function () {
    };
    ChessErrorComponent.prototype.resume = function () {
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function () {
            return tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"](this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.boardApi.resume()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], ChessErrorComponent.prototype, "board", void 0);
    ChessErrorComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-chess-error',
            template: __webpack_require__(/*! ./chess-error.component.html */ "./src/app/chess-error/chess-error.component.html"),
            styles: [__webpack_require__(/*! ./chess-error.component.scss */ "./src/app/chess-error/chess-error.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_api_board_api__WEBPACK_IMPORTED_MODULE_2__["BoardApi"]])
    ], ChessErrorComponent);
    return ChessErrorComponent;
}());



/***/ }),

/***/ "./src/app/chess-piece/chess-piece.component.html":
/*!********************************************************!*\
  !*** ./src/app/chess-piece/chess-piece.component.html ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div (dragover)=\"$event.preventDefault()\" (dragstart)=\"dragStart($event)\" [id]=\"this.piece.id\" class=\"piece\"\r\n     draggable=\"true\">\r\n\r\n</div>\r\n\r\n"

/***/ }),

/***/ "./src/app/chess-piece/chess-piece.component.scss":
/*!********************************************************!*\
  !*** ./src/app/chess-piece/chess-piece.component.scss ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ":host {\n  --x: 0;\n  --y: 0;\n  --x-calc: calc(var(--x) - 50%);\n  --y-calc: calc(var(--y) - 50%);\n  position: absolute;\n  left: 0;\n  top: 0;\n  -webkit-transform: translateY(var(--y-calc)) translateX(var(--x-calc));\n          transform: translateY(var(--y-calc)) translateX(var(--x-calc));\n  transition: all ease 0.3s;\n  --chess-background: none; }\n\n.piece {\n  width: 50px;\n  height: 50px;\n  background-image: var(--chess-background);\n  background-size: contain;\n  background-repeat: no-repeat; }\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvY2hlc3MtcGllY2UvQzpcXFVzZXJzXFxic2VyZ2VudFxcRG9jdW1lbnRzXFxTb3VyY2VcXDQwMmNoZXNzXFxhbmd1bGFyLWNoZXNzL3NyY1xcYXBwXFxjaGVzcy1waWVjZVxcY2hlc3MtcGllY2UuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFFRSxPQUFJO0VBQ0osT0FBSTtFQUVKLCtCQUFTO0VBQ1QsK0JBQVM7RUFFVCxtQkFBa0I7RUFDbEIsUUFBTztFQUNQLE9BQU07RUFDTix1RUFBOEQ7VUFBOUQsK0RBQThEO0VBQzlELDBCQUF5QjtFQUN6Qix5QkFBbUIsRUFHcEI7O0FBR0Q7RUFFRSxZQUFXO0VBQ1gsYUFBWTtFQUNaLDBDQUF5QztFQUN6Qyx5QkFBd0I7RUFDeEIsNkJBQTRCLEVBQzdCIiwiZmlsZSI6InNyYy9hcHAvY2hlc3MtcGllY2UvY2hlc3MtcGllY2UuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyI6aG9zdCB7XHJcblxyXG4gIC0teDogMDtcclxuICAtLXk6IDA7XHJcblxyXG4gIC0teC1jYWxjOiBjYWxjKHZhcigtLXgpIC0gNTAlKTtcclxuICAtLXktY2FsYzogY2FsYyh2YXIoLS15KSAtIDUwJSk7XHJcblxyXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICBsZWZ0OiAwO1xyXG4gIHRvcDogMDtcclxuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkodmFyKC0teS1jYWxjKSkgdHJhbnNsYXRlWCh2YXIoLS14LWNhbGMpKTtcclxuICB0cmFuc2l0aW9uOiBhbGwgZWFzZSAwLjNzO1xyXG4gIC0tY2hlc3MtYmFja2dyb3VuZDogbm9uZTtcclxuXHJcblxyXG59XHJcblxyXG5cclxuLnBpZWNlIHtcclxuXHJcbiAgd2lkdGg6IDUwcHg7XHJcbiAgaGVpZ2h0OiA1MHB4O1xyXG4gIGJhY2tncm91bmQtaW1hZ2U6IHZhcigtLWNoZXNzLWJhY2tncm91bmQpO1xyXG4gIGJhY2tncm91bmQtc2l6ZTogY29udGFpbjtcclxuICBiYWNrZ3JvdW5kLXJlcGVhdDogbm8tcmVwZWF0O1xyXG59XHJcbiJdfQ== */"

/***/ }),

/***/ "./src/app/chess-piece/chess-piece.component.ts":
/*!******************************************************!*\
  !*** ./src/app/chess-piece/chess-piece.component.ts ***!
  \******************************************************/
/*! exports provided: ChessPieceComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ChessPieceComponent", function() { return ChessPieceComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _models_IPieceModel__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../models/IPieceModel */ "./src/app/models/IPieceModel.ts");



var ChessPieceComponent = /** @class */ (function () {
    function ChessPieceComponent(elementRef) {
        this.elementRef = elementRef;
    }
    ChessPieceComponent.prototype.ngOnInit = function () {
        this.draw();
    };
    ChessPieceComponent.prototype.dragStart = function (event) {
        event.dataTransfer.setData('Text', this.piece.id.toString());
    };
    // Draw on every check
    ChessPieceComponent.prototype.ngDoCheck = function () {
        this.draw();
    };
    ChessPieceComponent.prototype.draw = function () {
        var background_property = 'url(\'/assets/pieces/' + this.piece.type + '_' + this.piece.team + '.png\')';
        this.elementRef.nativeElement.style.setProperty('--chess-background', background_property);
        this.setCoordinates();
    };
    ChessPieceComponent.prototype.setCoordinates = function () {
        this.elementRef.nativeElement.style.setProperty('--x', ((this.piece.column * 60) - 30) + 'px');
        this.elementRef.nativeElement.style.setProperty('--y', ((this.piece.row * 60) - 30) + 'px');
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _models_IPieceModel__WEBPACK_IMPORTED_MODULE_2__["IPieceModel"])
    ], ChessPieceComponent.prototype, "piece", void 0);
    ChessPieceComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-chess-piece',
            template: __webpack_require__(/*! ./chess-piece.component.html */ "./src/app/chess-piece/chess-piece.component.html"),
            styles: [__webpack_require__(/*! ./chess-piece.component.scss */ "./src/app/chess-piece/chess-piece.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"]])
    ], ChessPieceComponent);
    return ChessPieceComponent;
}());



/***/ }),

/***/ "./src/app/effects/BoardEffects.ts":
/*!*****************************************!*\
  !*** ./src/app/effects/BoardEffects.ts ***!
  \*****************************************/
/*! exports provided: BoardEffects */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BoardEffects", function() { return BoardEffects; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ngrx_effects__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ngrx/effects */ "./node_modules/@ngrx/effects/fesm5/effects.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _api_board_api__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../api/board.api */ "./src/app/api/board.api.ts");
/* harmony import */ var _actions_get_board_actions__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../actions/get-board.actions */ "./src/app/actions/get-board.actions.ts");







var BoardEffects = /** @class */ (function () {
    function BoardEffects(actions$, boardService) {
        var _this = this;
        this.actions$ = actions$;
        this.boardService = boardService;
        this.loadBoard$ = this.actions$
            .pipe(Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_2__["ofType"])(_actions_get_board_actions__WEBPACK_IMPORTED_MODULE_6__["GetBoardActionTypes"].LoadGetBoards), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["mergeMap"])(function () { return _this.boardService.getBoard()
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["map"])(function (board) { return new _actions_get_board_actions__WEBPACK_IMPORTED_MODULE_6__["LoadGetBoardsSuccess"](board); }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["catchError"])(function () { return rxjs__WEBPACK_IMPORTED_MODULE_3__["EMPTY"]; })); }));
        this.promotePiece$ = this.actions$
            .pipe(Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_2__["ofType"])(_actions_get_board_actions__WEBPACK_IMPORTED_MODULE_6__["GetBoardActionTypes"].PromotePiece), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["mergeMap"])(function (action) { return _this.boardService.promote(action.payload)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["map"])(function (board) { return new _actions_get_board_actions__WEBPACK_IMPORTED_MODULE_6__["PromotePieceSuccess"](); }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["catchError"])(function () { return rxjs__WEBPACK_IMPORTED_MODULE_3__["EMPTY"]; })); }));
        this.commitPiece$ = this.actions$
            .pipe(Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_2__["ofType"])(_actions_get_board_actions__WEBPACK_IMPORTED_MODULE_6__["GetBoardActionTypes"].CommitBoard), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["mergeMap"])(function () { return _this.boardService.commit()
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["map"])(function () { return new _actions_get_board_actions__WEBPACK_IMPORTED_MODULE_6__["CommitTurnSuccess"](); }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["catchError"])(function () { return rxjs__WEBPACK_IMPORTED_MODULE_3__["EMPTY"]; })); }));
        this.resetBoard$ = this.actions$
            .pipe(Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_2__["ofType"])(_actions_get_board_actions__WEBPACK_IMPORTED_MODULE_6__["GetBoardActionTypes"].ResetBoard), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["mergeMap"])(function () { return _this.boardService.reset()
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["map"])(function () { return new _actions_get_board_actions__WEBPACK_IMPORTED_MODULE_6__["ResetBoardSuccess"](); }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["catchError"])(function () { return rxjs__WEBPACK_IMPORTED_MODULE_3__["EMPTY"]; })); }));
    }
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_2__["Effect"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], BoardEffects.prototype, "loadBoard$", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_2__["Effect"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], BoardEffects.prototype, "promotePiece$", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_2__["Effect"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], BoardEffects.prototype, "commitPiece$", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_2__["Effect"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], BoardEffects.prototype, "resetBoard$", void 0);
    BoardEffects = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_ngrx_effects__WEBPACK_IMPORTED_MODULE_2__["Actions"], _api_board_api__WEBPACK_IMPORTED_MODULE_5__["BoardApi"]])
    ], BoardEffects);
    return BoardEffects;
}());



/***/ }),

/***/ "./src/app/interact/interact.component.html":
/*!**************************************************!*\
  !*** ./src/app/interact/interact.component.html ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"vh-100 vw-100\">\r\n    <div class=\"d-flex vh-100 justify-content-center\">\r\n\r\n\r\n        <div (click)=\"commit()\" class=\"pointer bg-success flex-grow-1 rounded-0 d-flex align-items-center justify-content-center text-white\">\r\n            <h4>Commit</h4>\r\n        </div>\r\n\r\n        <div (click)=\"reset()\" class=\"pointer bg-danger flex-fill rounded-0 d-flex align-items-center justify-content-center text-white\">\r\n            <h4>Reset</h4>\r\n        </div>\r\n\r\n    </div>\r\n</div>\r\n"

/***/ }),

/***/ "./src/app/interact/interact.component.scss":
/*!**************************************************!*\
  !*** ./src/app/interact/interact.component.scss ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".pointer {\n  cursor: pointer; }\n  .pointer:hover {\n    cursor: pointer; }\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvaW50ZXJhY3QvQzpcXFVzZXJzXFxic2VyZ2VudFxcRG9jdW1lbnRzXFxTb3VyY2VcXDQwMmNoZXNzXFxhbmd1bGFyLWNoZXNzL3NyY1xcYXBwXFxpbnRlcmFjdFxcaW50ZXJhY3QuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFFRSxnQkFBZSxFQUtoQjtFQVBEO0lBS0ksZ0JBQWUsRUFDaEIiLCJmaWxlIjoic3JjL2FwcC9pbnRlcmFjdC9pbnRlcmFjdC5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIi5wb2ludGVyIHtcclxuXHJcbiAgY3Vyc29yOiBwb2ludGVyO1xyXG5cclxuICAmOmhvdmVyIHtcclxuICAgIGN1cnNvcjogcG9pbnRlcjtcclxuICB9XHJcbn1cclxuXHJcbiJdfQ== */"

/***/ }),

/***/ "./src/app/interact/interact.component.ts":
/*!************************************************!*\
  !*** ./src/app/interact/interact.component.ts ***!
  \************************************************/
/*! exports provided: InteractComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InteractComponent", function() { return InteractComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ngrx/store */ "./node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _actions_get_board_actions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../actions/get-board.actions */ "./src/app/actions/get-board.actions.ts");




var InteractComponent = /** @class */ (function () {
    function InteractComponent(store) {
        this.store = store;
    }
    InteractComponent.prototype.ngOnInit = function () {
    };
    InteractComponent.prototype.commit = function () {
        this.store.dispatch(new _actions_get_board_actions__WEBPACK_IMPORTED_MODULE_3__["CommitTurn"]());
    };
    InteractComponent.prototype.reset = function () {
        this.store.dispatch(new _actions_get_board_actions__WEBPACK_IMPORTED_MODULE_3__["ResetBoard"]());
    };
    InteractComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-interact',
            template: __webpack_require__(/*! ./interact.component.html */ "./src/app/interact/interact.component.html"),
            styles: [__webpack_require__(/*! ./interact.component.scss */ "./src/app/interact/interact.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_2__["Store"]])
    ], InteractComponent);
    return InteractComponent;
}());



/***/ }),

/***/ "./src/app/main/main.component.html":
/*!******************************************!*\
  !*** ./src/app/main/main.component.html ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<router-outlet></router-outlet>\r\n"

/***/ }),

/***/ "./src/app/main/main.component.scss":
/*!******************************************!*\
  !*** ./src/app/main/main.component.scss ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL21haW4vbWFpbi5jb21wb25lbnQuc2NzcyJ9 */"

/***/ }),

/***/ "./src/app/main/main.component.ts":
/*!****************************************!*\
  !*** ./src/app/main/main.component.ts ***!
  \****************************************/
/*! exports provided: MainComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MainComponent", function() { return MainComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");


var MainComponent = /** @class */ (function () {
    function MainComponent() {
    }
    MainComponent.prototype.ngOnInit = function () {
    };
    MainComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-main',
            template: __webpack_require__(/*! ./main.component.html */ "./src/app/main/main.component.html"),
            styles: [__webpack_require__(/*! ./main.component.scss */ "./src/app/main/main.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
    ], MainComponent);
    return MainComponent;
}());



/***/ }),

/***/ "./src/app/modals/promotion/promotion.html":
/*!*************************************************!*\
  !*** ./src/app/modals/promotion/promotion.html ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header\">\r\n    <h4 class=\"modal-title pull-left\">Promotion</h4>\r\n    <button type=\"button\" class=\"close pull-right\" aria-label=\"Close\" (click)=\"bsModalRef.hide()\">\r\n        <span aria-hidden=\"true\">&times;</span>\r\n    </button>\r\n</div>\r\n<div class=\"modal-body\">\r\n\r\n\r\n    <!--&lt;!&ndash;<label>&ndash;&gt;-->\r\n    <!--&lt;!&ndash;<select [(ngModel)]=\"promotionType\" class=\"form-control\">&ndash;&gt;-->\r\n    <!--&lt;!&ndash;<option *ngFor=\"let item of pieceTypes\">{{item}}</option>&ndash;&gt;-->\r\n    <!--&lt;!&ndash;</select>&ndash;&gt;-->\r\n    <!--</label>-->\r\n\r\n    <div class=\"row justify-content-center text-center mb-5\">\r\n        <div class=\"col col-12\">\r\n            <h4><strong>To</strong></h4>\r\n        </div>\r\n        <div class=\"col col-auto \" *ngFor=\"let piece of pieceTypes\">\r\n            <app-chess-piece\r\n                    [piece]=\"piece\" style=\"position: relative !important;\"\r\n                    (click)=\"choosePromotion(piece)\"></app-chess-piece>\r\n        </div>\r\n    </div>\r\n\r\n</div>\r\n"

/***/ }),

/***/ "./src/app/modals/promotion/promotion.modal.ts":
/*!*****************************************************!*\
  !*** ./src/app/modals/promotion/promotion.modal.ts ***!
  \*****************************************************/
/*! exports provided: PromotionModalComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PromotionModalComponent", function() { return PromotionModalComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var ngx_bootstrap__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ngx-bootstrap */ "./node_modules/ngx-bootstrap/esm5/ngx-bootstrap.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ngrx/store */ "./node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _actions_get_board_actions__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../actions/get-board.actions */ "./src/app/actions/get-board.actions.ts");
/* harmony import */ var _api_board_api__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../api/board.api */ "./src/app/api/board.api.ts");






var PromotionModalComponent = /** @class */ (function () {
    function PromotionModalComponent(bsModalRef, store, boardApi) {
        this.bsModalRef = bsModalRef;
        this.store = store;
        this.boardApi = boardApi;
    }
    PromotionModalComponent.prototype.choosePromotion = function (piece) {
        this.store.dispatch(new _actions_get_board_actions__WEBPACK_IMPORTED_MODULE_4__["PromotePiece"](piece.type));
        this.boardApi.resume();
        this.bsModalRef.hide();
    };
    Object.defineProperty(PromotionModalComponent.prototype, "getTeam", {
        get: function () {
            return 'black';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PromotionModalComponent.prototype, "pieceTypes", {
        get: function () {
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
        },
        enumerable: true,
        configurable: true
    });
    PromotionModalComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-promotion-modal',
            template: __webpack_require__(/*! ./promotion.html */ "./src/app/modals/promotion/promotion.html")
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [ngx_bootstrap__WEBPACK_IMPORTED_MODULE_2__["BsModalRef"], _ngrx_store__WEBPACK_IMPORTED_MODULE_3__["Store"], _api_board_api__WEBPACK_IMPORTED_MODULE_5__["BoardApi"]])
    ], PromotionModalComponent);
    return PromotionModalComponent;
}());



/***/ }),

/***/ "./src/app/models/IPieceModel.ts":
/*!***************************************!*\
  !*** ./src/app/models/IPieceModel.ts ***!
  \***************************************/
/*! exports provided: IPieceModel */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IPieceModel", function() { return IPieceModel; });
var IPieceModel = /** @class */ (function () {
    function IPieceModel() {
    }
    return IPieceModel;
}());



/***/ }),

/***/ "./src/app/pipes/remove-empty.pipe.ts":
/*!********************************************!*\
  !*** ./src/app/pipes/remove-empty.pipe.ts ***!
  \********************************************/
/*! exports provided: RemoveEmptyPipe */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RemoveEmptyPipe", function() { return RemoveEmptyPipe; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");


var RemoveEmptyPipe = /** @class */ (function () {
    function RemoveEmptyPipe() {
    }
    RemoveEmptyPipe.prototype.transform = function (value, args) {
        var flattenedArray = [];
        value.forEach(function (value_of_array) {
            if (value_of_array instanceof Array) {
                flattenedArray.push.apply(flattenedArray, value_of_array);
            }
        });
        return flattenedArray.filter(function (piece) { return piece !== null && piece !== undefined; });
    };
    RemoveEmptyPipe = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Pipe"])({
            name: 'removeEmpty'
        })
    ], RemoveEmptyPipe);
    return RemoveEmptyPipe;
}());



/***/ }),

/***/ "./src/app/reducers/board-reducer.reducer.ts":
/*!***************************************************!*\
  !*** ./src/app/reducers/board-reducer.reducer.ts ***!
  \***************************************************/
/*! exports provided: initialState, boardReducer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "initialState", function() { return initialState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "boardReducer", function() { return boardReducer; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _actions_get_board_actions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../actions/get-board.actions */ "./src/app/actions/get-board.actions.ts");


var initialState = {
    board: null
};
function boardReducer(state, action) {
    if (state === void 0) { state = initialState; }
    switch (action.type) {
        case _actions_get_board_actions__WEBPACK_IMPORTED_MODULE_1__["GetBoardActionTypes"].LoadGetBoardsSuccess:
            return tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, state, { board: action.payload });
        case _actions_get_board_actions__WEBPACK_IMPORTED_MODULE_1__["GetBoardActionTypes"].PromotePieceSuccess:
            return tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, state);
        case _actions_get_board_actions__WEBPACK_IMPORTED_MODULE_1__["GetBoardActionTypes"].ResetBoardSuccess:
            return tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, state);
        case _actions_get_board_actions__WEBPACK_IMPORTED_MODULE_1__["GetBoardActionTypes"].CommitBoardSuccess:
            return tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, state);
        default:
            return state;
    }
}


/***/ }),

/***/ "./src/app/reducers/index.ts":
/*!***********************************!*\
  !*** ./src/app/reducers/index.ts ***!
  \***********************************/
/*! exports provided: reducers, metaReducers */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "reducers", function() { return reducers; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "metaReducers", function() { return metaReducers; });
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../environments/environment */ "./src/environments/environment.ts");
/* harmony import */ var _board_reducer_reducer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./board-reducer.reducer */ "./src/app/reducers/board-reducer.reducer.ts");


var reducers = {
    board: _board_reducer_reducer__WEBPACK_IMPORTED_MODULE_1__["boardReducer"]
};
var metaReducers = !_environments_environment__WEBPACK_IMPORTED_MODULE_0__["environment"].production ? [] : [];


/***/ }),

/***/ "./src/environments/environment.ts":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
var environment = {
    production: false
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser-dynamic */ "./node_modules/@angular/platform-browser-dynamic/fesm5/platform-browser-dynamic.js");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/app.module */ "./src/app/app.module.ts");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./environments/environment */ "./src/environments/environment.ts");




if (_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["enableProdMode"])();
}
Object(_angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__["platformBrowserDynamic"])().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"])
    .catch(function (err) { return console.error(err); });


/***/ }),

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! C:\Users\bsergent\Documents\Source\402chess\angular-chess\src\main.ts */"./src/main.ts");


/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main.js.map