import { Turn, TurnType } from "./Turn";
import { Board } from "./Board";
import { PieceMinimal, Piece, Team, PieceType } from "./Piece";
import BoardDriver from "./BoardDriver";
import Chalk from 'chalk';
import { State } from "./State";

export type Error = 'INVALID_TURN'|'GENERIC_ERROR'|'PAWN_PROMOTION'|'CANCEL_TURN'|'';

const DEBUG = true;

export default class BoardAPI {
	private static _history: Turn[]; // Record of all moves made
	private static _board: Board; // Virtual state of board at end of turn
	private static _boardRaw: PieceMinimal[][]; // Physical state of board in real time
	private static _boardDelta: boolean[][]; // True for cells interacted w/ this turn
	private static _ignoreMoves: boolean;
	private static _rawChangeQueue: RawChange[];
	private static _pollInterval: number = 10; // 200 is pretty good for debugging
	private static _teamCurrent: Team;
	private static _turnCommitQueued: boolean = false;
	private static _intervalId: NodeJS.Timeout = null;
	private static _error: Error = '';
	private static _errorDesc: string = '';
	private static _pendingTurn: Turn = null;

	public static get error(): Error {
		return this._error;
	}
	public static set error(err: Error) {
		if (err === '') {
			this._errorDesc = '';
			this._rawChangeQueue = [];
			this.zeroDelta();
			State.reset();
			this._boardRaw = this._board.minimize();
			if (this._error !== 'PAWN_PROMOTION') { // Turn should not be canceled for promotion
				this._turnCommitQueued = false;
				this._pendingTurn = null;
			}
			this._ignoreMoves = false;
			console.log(Chalk.gray('Errors cleared and piece detection enabled.'));
		} else {
			this._ignoreMoves = true;
			console.log(Chalk.gray('Piece detection disabled.'));
		}
		this._error = err;
	}
	public static get errorDesc(): string {
		return this._errorDesc;
	}

	/**
	 * Initialize board upon the start of a new game. 
	 */
	public static init(): void {
		// Zero everything. 
		this._board = new Board();
		this._board.initPieces();
		this._history = [];
		this._teamCurrent = 'white';
		this.error = '';
		this._ignoreMoves = true;
		State.reset();

		// Restart listening if already doing so
		if (this._intervalId !== null) {
			clearInterval(this._intervalId);
			this.listen();
		}
	}

	/**
	 * Listen for piece movements and turn commits. 
	 */
	public static listen(): void {
		this._intervalId = setInterval(() => {
			if (this._ignoreMoves) return;

			// Queue changes from physical board
			let col = BoardDriver.readColumn();
			for (let r = 0; r < 8; r++) {
				if (!col[r] && this._boardRaw[r][BoardDriver.readCol] !== null) { // Lift
					this._rawChangeQueue.push({ x: BoardDriver.readCol, y: r, lift: true, team: this._boardRaw[r][BoardDriver.readCol].team });
					this._boardRaw[r][BoardDriver.readCol] = null;
					this._boardDelta[r][BoardDriver.readCol] = true;
					console.log(Chalk.greenBright(`Picked up ${String.fromCharCode(65+BoardDriver.readCol)}${r+1}. ↑`));
				}
				if (col[r] && this._boardRaw[r][BoardDriver.readCol] === null) { // Drop
					this._rawChangeQueue.push({ x: BoardDriver.readCol, y: r, lift: false, team: 'unknown' });
					this._boardRaw[r][BoardDriver.readCol] = { type: 'unknown', team: 'unknown' };
					this._boardDelta[r][BoardDriver.readCol] = true;
					console.log(Chalk.green(`Put down ${String.fromCharCode(65+BoardDriver.readCol)}${r+1}. ↓`));
				}
			}
			BoardDriver.cycleColumn();


			// Process all queued changes
			for (let change of this._rawChangeQueue) {
				State.process(change, change.team === this._teamCurrent)
				if ((State.state === 'move' || State.state === 'error') && this.sumDelta() === 1 && !change.lift) {
					// Forget change if player put down a piece in the same cell it started in
					State.reset();
					this.zeroDelta();
				}
				if (DEBUG) console.log(`state=${State.state}`);
			}
			this._rawChangeQueue = [];
			
			// Check for turn end button
			if (this._turnCommitQueued) {
				if (this._pendingTurn === null) {
					let turntype = State.commit();
					if (turntype === 'invalid') {
						this.error = 'INVALID_TURN';
						this._errorDesc = 'Invalid state.';
						console.log(Chalk.redBright('Invalid state detected. Waiting for /board/resume request.'));
						return;
					}
					this._pendingTurn = this.postProcess(turntype);
					if (this._pendingTurn.type === 'invalid') {
						this.error = 'INVALID_TURN';
						this._errorDesc = 'Post processing failed.';
						console.log(Chalk.redBright('Invalid move processed. Waiting for /board/resume request.'));
						return;
					}

					if (this._pendingTurn.type === 'pawnpromotion') {
						this.error = 'PAWN_PROMOTION';
						this._errorDesc = `Promoting ${this._pendingTurn.actor.toString()}.`;
						console.log('Pawn promotion detected. Waiting for /board/promote/{type} request.');
						return;
					}
				}
				if (!this._pendingTurn.isValid(this._board)) {
					this.error = 'INVALID_TURN';
					this._errorDesc = 'Turn was detected correctly, but was against the rules.';
					console.log(Chalk.redBright('Illegal move processed. Waiting for /board/resume request.'));
					return;
				}

				this._board.applyTurn(this._pendingTurn);
				
				console.log('Committed turn.');
				this._turnCommitQueued = false;
				this.zeroDelta();
				this._history.push(this._pendingTurn);
				this._boardRaw = this._board.minimize();
				this._pendingTurn = null;
				// Switch current team
				if (this._teamCurrent === 'white')
					this._teamCurrent = 'black';
				else if (this._teamCurrent === 'black')
					this._teamCurrent = 'white';
				console.log(`Now ${this._teamCurrent}'s turn.`);
			}
		}, this._pollInterval);
	}

	private static postProcess(type: TurnType): Turn {
		if (DEBUG) {
			console.log(Chalk.gray(`turntype=${type}`));
			this.printBoardState();
		}

		let boardInit = this._board.grid;
		let boardFinal = this._boardRaw;

		let turn = new Turn();
		turn.type = type;
		if (type === 'invalid') return turn;

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
		if (turn.actor === null) {
			// The player probably moved the wrong team's piece
			console.log(Chalk.redBright(`Actor for turn of type ${type} not detected. It is likely the wrong player moved. The current player is ${this._teamCurrent}.`));
			if (!DEBUG) this.printBoardState();
			turn.type = 'invalid';
			return turn;
		}
		console.log(Chalk.greenBright(`actor=${turn.actor.toString()}`));

		// Find final position of moving piece (newly occupied cell)
		if (type === 'move' || type === 'castle') {
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

			// Maintain whether pawn movement was single or double for enpassant validity checking later
			if (turn.actor.type === 'pawn') {
				turn.meta.doublepawn = Math.abs(turn.y1 - turn.y2) > 1;
				if (DEBUG) console.log(Chalk.gray(`turn.meta.doublepawn=${turn.meta.doublepawn}`));
			}
		}
		
		// If take, find target (opposing team that no longer exists on square w/ changes)
		if (type === 'take' || type === 'enpassant') {
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

			// TODO Check if en-passant (put-down does not match either pick-up) and set turn type
		}

		if (type === 'castle') {
			// Find the piece that hasn't beed logged yet (king if actor==rook, rook if actor==king)
			actor2Detection:
			for (let r = 0; r < 8; r++) {
				for (let c = 0; c < 8; c++) {
					if (!this._boardDelta[r][c]) continue; // Skip cells w/o change

					// Add second (and hopefully only other) cell newly vacated by current team
					if (boardInit[r][c] !== null
							&& boardInit[r][c].team === this._teamCurrent
							&& boardFinal[r][c] === null
							&& boardInit[r][c] !== turn.actor) {
						turn.actor2 = boardInit[r][c];
						break actor2Detection;
					}
				}
			}
			console.log(Chalk.greenBright(`actor2=${turn.actor2.toString()}`));

			// Swap king and rook so that turn.actor = king
			if (turn.actor.type !== 'king') {
				let temp = turn.actor;
				turn.actor = turn.actor2;
				turn.actor2 = temp;
			}

			// Detect rook's final position (might actually be king's final position)
			moveDetection:
			for (let r = 0; r < 8; r++) {
				for (let c = 0; c < 8; c++) {
					if (!this._boardDelta[r][c]) continue; // Skip cells w/o change

					// Was unoccupied and is now occupied, but not the same as previously detected
					if (boardInit[r][c] === null
							&& boardFinal[r][c] !== null
							&& !(c === turn.x2
								&& r === turn.y2)) {
						turn.x4 = c;
						turn.y4 = r;
						break moveDetection;
					}
				}
			}
			// Attempt to swap rook and king's final positions to make more sense if necessary
			// y-position should be consistent, so ignore that, but should be checked in the validity checker
			if (turn.x2 !== 2 && turn.x2 !== 6) { // If king not at one of the possible king spots, swap
				let tmp = turn.x2;
				turn.x2 = turn.x4;
				turn.x4 = tmp;
			}
			
			// Sub-classify castle turn type depending on king's final location
			turn.meta.kingside = boardFinal[turn.actor.y][6] !== null
				&& boardFinal[turn.actor.y][6].type === 'king'
				&& boardFinal[turn.actor.y][6].team === this._teamCurrent;
			if (DEBUG) console.log(Chalk.gray(`turn.meta.kingside=${turn.meta.kingside}`));
		}

		// Check for pawn promotion
		if (turn.actor.type === 'pawn'
				&& ((turn.actor.team === 'black' && turn.y2 === 0)
					|| (turn.actor.team === 'white' && turn.y2 === 7))) {
			turn.type = 'pawnpromotion';
			if (DEBUG) console.log(Chalk.gray(`turntype=pawnpromotion`));
		}
		// TODO The black and white here depend on starting positions here, so make sure the indexing is correct
		
		return turn;
	}

	private static printBoardState(): void {
		// Print header
		console.log(Chalk.gray('  ==[ ')
			+ Chalk.white('Initial') + Chalk.gray(' ]========[ ')
			+ Chalk.white('Delta') + Chalk.gray(' ]========[ ')
			+ Chalk.white('Current') + Chalk.gray(' ]=='));
		
		let lines: string[] = this._board.toString().split('\n');
		lines[0] += Chalk.gray('   A B C D E F G H   A B C D E F G H');
		console.log(lines[0]);

		// Append and print the delta and current boards
		for (let l = 1; l < lines.length; l++) {
			lines[l] += '   ';
			// Print delta board
			for (let x = 0; x < this._boardDelta[l-1].length; x++) {
				if (this._boardDelta[8-l][x])
            lines[l] += Chalk.white('1 ');
          else
            lines[l] += Chalk.gray('0 ');
			}
			lines[l] += '  ';
			// Print hardware state board
			for (let x = 0; x < this._boardRaw[l-1].length; x++) {
				if (this._boardRaw[8-l][x] !== null)
            lines[l] += Chalk.white('1 ');
          else
            lines[l] += Chalk.gray('0 ');
			}
			console.log(lines[l]);
		}
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

	private static sumDelta(): number {
		let sum = 0;
		for (let r = 0; r < 8; r++)
			for (let c = 0; c < 8; c++)
				if (this._boardDelta[r][c])
					sum++;
		return sum;
	}

	// RESTful Endpoints
	// Named as <method><Action>()
	public static getBoard(): string {
		return JSON.stringify({
			message: this.error,
			description: this.errorDesc,
			pieces: this._board.serialize()
		});
	}

	public static postPause(): void {
		this._ignoreMoves = true;
		console.log('Piece detection disabled.');
	}

	public static postResume(): void {
		this.error = '';
	}

	public static postTurn(): void {
		if (this.error)
			throw 'Cannot commit turn while error is pending.';
		console.log('Committing turn...');
		this._turnCommitQueued = true;
	}
	
	public static postCancel(): void {
		console.log(`Cancelling turn... Board state should be returned to \n${this._board.toString()}\nWaiting for /board/resume.`);
		this.error = 'CANCEL_TURN';
	}

	public static postPromote(type: PieceType): void {
		if (this.error !== 'PAWN_PROMOTION')
			throw 'No pawns are being promoted.';
		this._pendingTurn.actor.promote(type);
		console.log(`Promoted ${this._pendingTurn.actor.toString()} to type ${type}. Waiting for /board/resume request.`);
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
}

export interface RawChange {
	x: number,
	y: number,
	lift: boolean,
	team: Team
}
