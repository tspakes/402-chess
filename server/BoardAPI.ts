import { Turn } from "./Turn";
import { Board } from "./Board";
import { PieceMinimal, Piece } from "./Piece";

export default class BoardAPI {
	private static _history: Turn[] = []; // Record of all moves made
	private static _board: Board; // Virtual state of board at end of turn
	private static _boardRaw: PieceMinimal[][]; // Physical state of board in real time
	private static _moveCurrent: Turn; // Probably gonna need a custom class
	private static _ignoreMoves: boolean;

	public static listen(): void {
		setTimeout(() => {
			// Check for piece movement
				// Update board_raw
				// Update GPIO for to read next input after 10ms
			// Check for turn end button
				// Check move validity
				// Update committed board if move was valid
				if (this._board.movePiece(this._moveCurrent))
					this._boardRaw = this._board.minimize();
				else {
					console.error('Invalid move detected. Please move pieces to previous positions.');
					this._ignoreMoves = true;
					while (this._ignoreMoves) {} // Obviously bad logic, just have this here until I can actually write this
					// Wait until local website confirms pieces have been moved to previous state
					// Probably have the _ignoreMoves/wait use this 10ms loop
					this._boardRaw = this._board.minimize();
				}
		}, 10);
		// TODO Keep invalid state boolean somewhere
	}

	// RESTful Endpoints
  public static getBoard(): string {
		return JSON.stringify(this._board.serialize());
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