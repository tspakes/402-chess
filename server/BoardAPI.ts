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
	private static _rawChangeQueue: { x: number, y: number, lift: boolean, team: Team }[] = [];
	private static _pollInterval: number = 10; // 200 is pretty good for debugging
	private static _currentTeam: Team;

	public static init(): void { // Called every time a new game is started
		this._board = new Board();
		this._board.initPieces();
		this._history = [];
		this._ignoreMoves = true;
		this._currentTeam = 'white';

		// Initialize raw board
		this._boardRaw = this._board.minimize();
	}

	public static listen(): void { // Looping to check columns for changes
		setInterval(() => {
		//setTimeout(() => {
			if (this._ignoreMoves) return;

			let col = BoardDriver.readColumn(); // Read the current column
			for (let r = 0; r < 8; r++) { // Check for lift
				if (!col[r] && this._boardRaw[r][BoardDriver.readCol] !== null) { // Piece not on physical board, but is on virtual, so piece lifted
					this._rawChangeQueue.push({ x: BoardDriver.readCol, y: r, lift: true }); // Record the change
					this._boardRaw[r][BoardDriver.readCol] = null; // Establish the change in understanding of physical board
					console.log(Chalk.greenBright(`Picked up ${String.fromCharCode(66+BoardDriver.readCol)}${r+1}. ↑`)); // Output lift
				}
				if (col[r] && this._boardRaw[r][BoardDriver.readCol] === null) { // Check for drop
					this._rawChangeQueue.push({ x: BoardDriver.readCol, y: r, lift: false }); // Piece not on virtual, but is on physical, so piece dropped
					this._boardRaw[r][BoardDriver.readCol] = { type: 'unknown', team: 'unknown' }; // Record the change, uncertain of the piece
					console.log(Chalk.green(`Put down ${String.fromCharCode(66+BoardDriver.readCol)}${r+1}. ↓`)); // Output drop
				}
			}
			BoardDriver.cycleColumn(); // Go to the next column



			for (let change of this._rawChangeQueue) { // Process all queued changes
					state.Process(change, change.team == this._currentTeam)
			}
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
				// 	this._boardRaw = this._board.minimize(); // All unknowns are replaced with appropriate values
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
		if (this._currentTeam == 'white') { // Switch team from white to black
			this._currentTeam = 'black';
		} else if (this._currentTeam == 'black') { // Switch team from black to white
			this._currentTeam = 'white'
		}
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

export interface RawChange {
	x: number,
	y: number,
	lift: boolean,
	team: Team
}
