import { Turn, TurnType, TurnSerialized, CheckType } from "./Turn";
import { Board } from "./Board";
import { PieceMinimal, Piece, Team, PieceType } from "./Piece";
import BoardDriver from "./BoardDriver";
import Chalk from 'chalk';
import { State } from "./State";

export type Error = 'INVALID_TURN'|'GENERIC_ERROR'|'PAWN_PROMOTION'|'CANCEL_TURN'|'UNDO_TURN'|'';

const DEBUG = true;

export default class BoardAPI {
	private static _history: Turn[]; // Record of all moves made
	private static _board: Board; // Virtual state of board at end of turn
	private static _boardRaw: PieceMinimal[][]; // Physical state of board in real time
	private static _boardDelta: boolean[][]; // True for cells interacted w/ this turn
	private static _ignoreMoves: boolean;
	private static _rawChangeQueue: RawChange[];
	private static _pollInterval: number = 10; // 200 is pretty good for debugging, 10 for production
	private static _teamCurrent: Team;
	private static _turnCommitQueued: boolean = false;
	private static _intervalId: NodeJS.Timeout = null;
	private static _error: Error = '';
	public static errorDesc: string = '';
	private static _pendingTurn: Turn = null;
	public static validityChecking: boolean = true;

	public static get error(): Error {
		return this._error;
	}
	public static set error(err: Error) {
		if (err === '') {
			this.errorDesc = '';
			this._rawChangeQueue = [];
			this.zeroDelta();
			State.reset();
			if (this._error !== 'PAWN_PROMOTION') { // Turn should not be canceled for promotion
				this._boardRaw = this._board.minimize();
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

	/**
	 * Initialize board upon the start of a new game. 
	 */
	public static init(): void {
		// Zero everything. 
		this._board = new Board();
		this._board.initPieces();
		this._history = [];
		BoardDriver.init();
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

			this.readRawChanges();
			this.processRawChanges();
			
			if (this._turnCommitQueued)
				this.commitTurn();
		}, this._pollInterval);
	}

	private static readRawChanges(): void {
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
	}

	private static processRawChanges(): void {
		// Make sure pick ups are always read before putdowns
		this._rawChangeQueue = this._rawChangeQueue.sort((a, b) => {
			return (b.lift as unknown as number) - (a.lift as unknown as number);
		});
		// Process all queued changes
		for (let change of this._rawChangeQueue) {
			State.process(change, change.team === this._teamCurrent);
			if ((State.state === 'move' || State.state === 'error') && this.sumDelta() === 1 && !change.lift) {
				// Forget change if player put down a piece in the same cell it started in
				State.reset();
				this.zeroDelta();
				if (this._board.grid[change.y][change.x] !== null)
					this._boardRaw[change.y][change.x] = this._board.grid[change.y][change.x].minimize();
			}
			if (DEBUG) console.log(`state=${State.state}`);
		}
		this._rawChangeQueue = [];
	}

	private static commitTurn(): void {
		if (this._pendingTurn === null) {
			let turntype = State.commit();
			if (turntype === 'invalid') {
				this.error = 'INVALID_TURN';
				this.errorDesc = 'Invalid state.';
				console.log(Chalk.redBright('Invalid state detected. Waiting for /board/resume request.'));
				return;
			}
			this._pendingTurn = this.qualifyTurn(turntype);
			if (this._pendingTurn.type === 'invalid') {
				this.error = 'INVALID_TURN';
				if (this.errorDesc === '')
					this.errorDesc = 'Post processing failed.';
				console.log(Chalk.redBright(this.errorDesc));
				console.log(Chalk.redBright('Invalid move processed. Waiting for /board/resume request.'));
				return;
			}

			if (this._pendingTurn.type === 'pawnpromotion') {
				this.error = 'PAWN_PROMOTION';
				this.errorDesc = `Promoting ${this._pendingTurn.actor.toString()}.`;
				console.log('Pawn promotion detected. Waiting for /board/promote/{type} request.');
				return;
			}
		}
		if (!this._pendingTurn.isValid(this._board) && this.validityChecking) {
			this.error = 'INVALID_TURN';
			if (this.errorDesc === '')
				this.errorDesc = 'Turn was detected correctly, but was against the rules.';
			console.log(Chalk.redBright('Illegal move processed. Waiting for /board/resume request.'));
			return;
		}

		this._board.applyTurn(this._pendingTurn);
		this.switchTeam();

		console.log(`Committed ${this._pendingTurn.notation}.`);
		this._turnCommitQueued = false;
		this.zeroDelta();
		this._history.push(this._pendingTurn);
		this._boardRaw = this._board.minimize();
		this._pendingTurn.check = this.isCheck();
		this._pendingTurn = null;
	}

	public static serializeHistory(): TurnSerialized[] {
		let ser: TurnSerialized[] = [];
		for (let t of this._history)
			ser.push(t.serialize());
		return ser;
	}

	private static qualifyTurn(type: TurnType): Turn {
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
			this.errorDesc = `Actor for turn of type ${type} not detected. It is likely the wrong player moved. The current player is ${this._teamCurrent}.`;
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

					// Target set to changed cell that was an enemy
					if (boardInit[r][c] !== null
							&& boardInit[r][c].team !== this._teamCurrent)
						turn.target = boardInit[r][c];

					// Locate actor's final position
					if (boardFinal[r][c] !== null) {
						turn.x2 = c;
						turn.y2 = r;
					}
				}
			}
			console.log(Chalk.greenBright(`target=${turn.target.toString()}`));

			// Check if en-passant (put-down does not match either pick-up)
			if (type !== 'enpassant' && turn.actor.type === 'pawn'
					&& (turn.x2 !== turn.target.x || turn.y2 !== turn.target.y)) {
				turn.type = 'enpassant';
				if (DEBUG) console.log(Chalk.gray(`turn.type=${turn.type}`));
			}
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
			if (turn.actor2 === null) {
				// The player probably moved the wrong team's piece
				this.errorDesc = `Rook not detected. It is likely ${this._teamCurrent} tried to take their own piece.`;
				if (!DEBUG) this.printBoardState();
				turn.type = 'invalid';
				return turn;
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
			turn.meta.kingside = boardFinal[turn.actor.y][7] !== null
				&& boardFinal[turn.actor.y][7].type === 'king'
				&& boardFinal[turn.actor.y][7].team === this._teamCurrent;
			if (DEBUG) console.log(Chalk.gray(`turn.meta.kingside=${turn.meta.kingside}`));
		}

		// Check for pawn promotion
		if (turn.actor.type === 'pawn'
				&& ((turn.actor.team === 'black' && turn.y2 === 0)
					|| (turn.actor.team === 'white' && turn.y2 === 7))) {
			turn.type = 'pawnpromotion';
			if (DEBUG) console.log(Chalk.gray(`turntype=pawnpromotion`));
		}

		// Check for first movement for actor (needed for en passant after undo)
		if (!turn.actor.hasMoved)
			turn.meta.firstMove = true;
		
		turn.generateNotation(this._board);
		return turn;
	}

	private static isCheck(): CheckType {
		let check: CheckType = '';
		let movesPossible: boolean = false;
		let checkEscapePossible: boolean = false;

		// Check
		let king = this._board.getMatchingPieces(this._teamCurrent, [ 'king' ])[0];
		// if (DEBUG) {
		// 	console.log(Chalk.gray('  ==[') + Chalk.white(' Threat ') + Chalk.gray(']==='));
		// 	BoardAPI.printGrid(this._board.getThreatenedSpaces(this.getOppTeam(this._teamCurrent)));
		// }
		if (this._board.getThreatenedSpaces(this.getOppTeam(this._teamCurrent))[king.y][king.x])
			check = 'check';
		else
			checkEscapePossible = true; // Bc wasn't even in check

		// Checkmate and stalemate detection (very slow)
		possibleMoveLoop:
		for (let p of this._board.getMatchingPieces(this._teamCurrent))
			for (let t of p.getPossibleTurns(this._board)) {
				movesPossible = true;
				if (!checkEscapePossible || !this._board.getThreatenedSpaces(this.getOppTeam(this._teamCurrent), t)[king.y][king.x])
					checkEscapePossible = true;
				if (checkEscapePossible)
					break possibleMoveLoop;
			}
		this.errorDesc = '';

		// Classify checkmate and stalemate
		if (!checkEscapePossible) check = 'checkmate';
		else if (!movesPossible) check = 'stalemate';

		if (check !== '')
			console.log(`${check.substr(0, 1).toUpperCase()}${check.substr(1)} detected.`);

		return check;
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

	private static printGrid(grid: boolean[][]): void {
		let line: string;
		console.log(Chalk.gray('  A B C D E F G H'));
		for (let r = 7; r >= 0; r--) {
			line = Chalk.gray(`${r + 1} `);
			for (let c = 0; c < 8; c++)
				line += grid[r][c] ? Chalk.white('1 ') : Chalk.gray('0 ');
			console.log(line);
		}
	}

	private static switchTeam(): void {
		this._teamCurrent = this.getOppTeam(this._teamCurrent);
		console.log(`Now ${this._teamCurrent}'s turn.`);
	}

	public static getOppTeam(team: Team): Team {
		if (team === 'white') return 'black';
		else if (team === 'black') return 'white';
		else return 'unknown';
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

	// #region RESTful Endpoints
	// Named as <method><Action>()
	public static getBoard(): string {
		return JSON.stringify({
			message: this.error,
			description: this.errorDesc,
			currentTeam: this._teamCurrent,
			pieces: this._board.serialize(),
			history: this.serializeHistory()
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
		this.errorDesc = 'Move pieces back to their locations at the start of the current turn.';
	}
	
	public static postUndo(): any {
		if (this.sumDelta() > 0)
			throw 'A turn is currently pending. Cancel the current turn before undoing the last turn.';
		if (this._history.length <= 0)
			throw 'No turns remain to be undone.';
		this._board.undoTurn(this._history[this._history.length - 1]);
		this._history.pop();
		this._board.lastTurn = this._history[this._history.length - 1];
		this.switchTeam();
		console.log(`Undoing last turn... Board state should be returned to \n${this._board.toString()}\nWaiting for /board/resume.`);
		this.error = 'UNDO_TURN';
		this.errorDesc = 'Move pieces to their locations at the start of the previous turn.';
	}

	public static postPromote(type: PieceType): void {
		if (this.error !== 'PAWN_PROMOTION')
			throw 'No pawns are being promoted.';
		this._pendingTurn.actor.promote(type);
		this._pendingTurn.promotion = type;
		console.log(`Promoted ${this._pendingTurn.actor.toString()} to type ${type}. Waiting for /board/resume request.`);
	}

	public static getHistory(): string {
		let hist = [];
		for (let t of this._history)
			hist.push(t.serialize());
		return JSON.stringify(hist);
	}
	// #endregion
}

export interface RawChange {
	x: number,
	y: number,
	lift: boolean,
	team: Team
}
