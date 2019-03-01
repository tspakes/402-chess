import { Turn, TurnType } from "./Turn";
import { Board } from "./Board";
import { PieceMinimal, Piece } from "./Piece";
import BoardDriver from "./BoardDriver";
import Chalk from 'chalk';

export default class BoardAPI {
	private static _history: Turn[]; // Record of all moves made
	private static _board: Board; // Virtual state of board at end of turn
	private static _boardRaw: PieceMinimal[][]; // Physical state of board in real time
	private static _ignoreMoves: boolean;
	private static _possibleTurnTypes: TurnType[];
	private static _rawChangeQueue: { x: number, y: number, lift: boolean }[] = [];
	private static _pollInterval: number = 10; // 200 is pretty good for debugging

	public static init(): void {
		this._board = new Board();
		this._board.initPieces();
		this._history = [];
		this._ignoreMoves = true;

		// Initialize raw board
		this._boardRaw = this._board.minimize();
	}

	public static listen(): void {
		setInterval(() => {
		//setTimeout(() => {
			if (this._ignoreMoves) return;

			let col = BoardDriver.readColumn();
			for (let r = 0; r < 8; r++) {
				if (!col[r] && this._boardRaw[r][BoardDriver.readCol] !== null) {
					this._rawChangeQueue.push({ x: BoardDriver.readCol, y: r, lift: true });
					this._boardRaw[r][BoardDriver.readCol] = null;
					console.log(Chalk.greenBright(`Picked up ${String.fromCharCode(66+BoardDriver.readCol)}${r+1}. ↑`));
				}
				if (col[r] && this._boardRaw[r][BoardDriver.readCol] === null) {
					this._rawChangeQueue.push({ x: BoardDriver.readCol, y: r, lift: false });
					this._boardRaw[r][BoardDriver.readCol] = { type: 'unknown', team: 'unknown' };
					console.log(Chalk.green(`Put down ${String.fromCharCode(66+BoardDriver.readCol)}${r+1}. ↓`));
				}
			}
			BoardDriver.cycleColumn();

			// TODO Process raw changes via move state machine
			
			// Check for turn end button
				// Check move validity
				// Update committed board if move was valid
				
				// if (this._board.movePiece(this._moveCurrent))
				// 	this._boardRaw = this._board.minimize();
				// else {
				// 	console.error('Invalid move detected. Please move pieces to previous positions.');
				// 	this._ignoreMoves = true;
				// 	while (this._ignoreMoves) {} // Obviously bad logic, just have this here until I can actually write this
				// 	// Wait until local website confirms pieces have been moved to previous state
				// 	// Probably have the _ignoreMoves/wait use this 10ms loop
				// 	this._boardRaw = this._board.minimize();
				// }
		}, this._pollInterval);
		// TODO Keep invalid state boolean somewhere
	}

	// RESTful Endpoints
	// Named as <method><Action>()
	public static getBoard(): string {
		return JSON.stringify(this._board.minimize());
	}

	public static postPause(): void {
		this._ignoreMoves = true;
		console.log('Piece detection disabled.');
	}

	public static postResume(): void {
		this._ignoreMoves = false;
		console.log('Piece detection enabled.');
	}

	public static postTurn(): void {
		// TODO Add boolean for end turn triggered for next tick
		console.log('Committed turn.');
	}

	public static getHistory(): string {
		let hist = [];
		for (let t of this._history)
			hist.push(t.serialize());
		return JSON.stringify(hist);
	}

	/**
	 * Call during pawn promotion to select which type of piece was placed on the board. 
	 * @param type Piece type to be promoted to
	 */
	public static setPromotion(type: string): void {
		// Check that type is a valid type
		//piece.promote(type);
	}

	/**
	 * Call when pieces have been returned to their previous states to resume move detection. 
	 */
	public static setUndo(): void {
		this._ignoreMoves = false;
	}
}
