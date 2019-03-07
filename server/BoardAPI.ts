import { Turn, TurnType } from "./Turn";
import { Board } from "./Board";
import { PieceMinimal, Piece, Team } from "./Piece";
import BoardDriver from "./BoardDriver";
import Chalk from 'chalk';
import { State } from "./State";

export default class BoardAPI {
	private static _history: Turn[]; // Record of all moves made
	private static _board: Board; // Virtual state of board at end of turn
	private static _boardRaw: PieceMinimal[][]; // Physical state of board in real time
	private static _boardDelta: boolean[][]; // True for cells interacted w/ this turn
	private static _ignoreMoves: boolean;
	private static _rawChangeQueue: RawChange[] = [];
	private static _pollInterval: number = 10; // 200 is pretty good for debugging
	private static _teamCurrent: Team = 'white';
	private static _turnCommitQueued: boolean = false;

	/**
	 * Initialize board upon the start of a new game. 
	 */
	public static init(): void {
		this._board = new Board();
		this._board.initPieces();
		this._history = [];
		this._ignoreMoves = true;
		this.zeroDelta();

		// Initialize raw board
		this._boardRaw = this._board.minimize();
	}

	/**
	 * Listen for piece movements and turn commits. 
	 */
	public static listen(): void {
		setInterval(() => {
			if (this._ignoreMoves) return;

			let col = BoardDriver.readColumn();
			for (let r = 0; r < 8; r++) {
				if (!col[r] && this._boardRaw[r][BoardDriver.readCol] !== null) {
					this._rawChangeQueue.push({ x: BoardDriver.readCol, y: r, lift: true, team: this._boardRaw[r][BoardDriver.readCol].team });
					this._boardRaw[r][BoardDriver.readCol] = null;
					this._boardDelta[r][BoardDriver.readCol] = true;
					console.log(Chalk.greenBright(`Picked up ${String.fromCharCode(66+BoardDriver.readCol)}${r+1}. ↑`));
				}
				if (col[r] && this._boardRaw[r][BoardDriver.readCol] === null) {
					this._rawChangeQueue.push({ x: BoardDriver.readCol, y: r, lift: false, team: 'unknown' });
					this._boardRaw[r][BoardDriver.readCol] = { type: 'unknown', team: 'unknown' };
					this._boardDelta[r][BoardDriver.readCol] = true;
					console.log(Chalk.green(`Put down ${String.fromCharCode(66+BoardDriver.readCol)}${r+1}. ↓`));
				}
			}
			BoardDriver.cycleColumn(); // Go to the next column


			// Process all queued changes
			for (let change of this._rawChangeQueue)
				State.process(change, change.team == this._teamCurrent)
			
			// Check for turn end button
			if (this._turnCommitQueued) {
				// If no delta and invalid, ignore changes (can't end turn w/o doing anything)
				let turn = this.postProcess('move');//state.commit());
				if (this._board.applyTurn(turn)) {
					console.log('Committed turn.');
					this._turnCommitQueued = false;
					this.zeroDelta();
					this._history.push(turn);
					// this._boardRaw = this._board.minimize();
					// Switch current team
					if (this._teamCurrent === 'white')
						this._teamCurrent = 'black';
					else if (this._teamCurrent === 'black')
						this._teamCurrent = 'white'
				} else {
					throw 'Invalid move';
					this._ignoreMoves = true;
					// TODO Notify webserver w/ some state information (publish ignore moves && turn committed?)
					// Wait for undo
				}
			}
		}, this._pollInterval);
		// TODO Keep invalid state boolean somewhere
	}

	private static postProcess(type: TurnType): Turn {
		let boardInit = this._board.grid;
		let boardFinal = this._boardRaw;

		let turn = new Turn();
		turn.type = type;

		// Find actor (current team's piece that moved)
		actorDetection:
		for (let r = 0; r < 8; r++) {
			for (let c = 0; c < 8; c++) {
				if (!this._boardDelta[r][c]) continue; // Skip cells w/o change

				// Add first cell newly vacated by current team (for castling, just picks either king or rook)
				if (boardInit[r][c] !== null
						&& boardInit[r][c].team === this._teamCurrent
						&& boardFinal[r][c] === null) {
					turn.actor = boardInit[r][c];
					break actorDetection;
				}
			}
		}
		console.log(Chalk.greenBright(`actor=${turn.actor.toString()}`));

		// Find final position of moving piece (newly occupied cell)
		if (type === 'move') {
			moveDetection:
			for (let r = 0; r < 8; r++) {
				for (let c = 0; c < 8; c++) {
					if (!this._boardDelta[r][c]) continue; // Skip cells w/o change

					// Was unoccupied and is now occupied
					if (boardInit[r][c] === null
							&& boardFinal[r][c] !== null) {
						turn.x2 = c;
						turn.y2 = r;
						break moveDetection;
					}
				}
			}
		}
		
		// If take, find target (opposing team that no longer exists on square w/ changes)
		if (type === 'take') {
			targetDetection:
			for (let r = 0; r < 8; r++) {
				for (let c = 0; c < 8; c++) {
					if (!this._boardDelta[r][c]) continue; // Skip cells w/o change

					// Add cells still occupied that were changed
					if (boardFinal[r][c] !== null) {
						turn.target = boardInit[r][c];
						break targetDetection;
					}
				}
			}
			console.log(Chalk.greenBright(`target=${turn.target.toString()}`));
		}

		switch (type) {
			case 'move':
				// Check if pawn and back-row, promote if true
				break;
			case 'take':
				// Check if en-passant (put-down does not match either pick-up)
				break;
			case 'castle':
				// Should be two actors, check both king and rook
				break;
		}
		
		return turn;
	}

	private static zeroDelta(): void {
		this._boardDelta = [];
		for (let r = 0; r < 8; r++) {
			this._boardDelta[r] = [];
			for (let c = 0; c < 8; c++) {
				this._boardDelta[r][c] = false;
			}
		}
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
		console.log('Committing turn...');
		this._turnCommitQueued = true;
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
