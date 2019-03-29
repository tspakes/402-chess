import { Board } from "./Board";
import { Turn } from "./Turn";
import BoardAPI from "./BoardAPI";

export type PieceType = 'king'|'queen'|'bishop'|'knight'|'rook'|'pawn'|'unknown';
export type Team = 'black'|'white'|'unknown';

export class Piece {

	public static notationFromType(type: PieceType): 'K'|'Q'|'B'|'N'|'R'|'' {
		switch (type) {
			case 'king':
				return 'K';
			case 'queen':
				return 'Q';
			case 'bishop':
				return 'B';
			case 'knight':
				return 'N';
			case 'rook':
				return 'R';
			default:
				return '';
		}
	}
	/**
	 * Convert the column index to the corresponding letter for display.
	 * @param col Zero-indexed column on the chessboard
	 * @param capital Omit for lowercase, true for uppercase
	 */
	public static colToLetter(col: number, capital: boolean = false): string {
		return String.fromCharCode((capital?65:97/*a:A*/) + col);
	}

	private _type: PieceType;
	private _team: Team;
	private _x: number;
	private _y: number;
	private _id: number;
	private static _nextId: number = 0;
	public hasMoved: boolean = false;

	public static resetId() {
		this._nextId = 0;
	}

	constructor(type: PieceType, team: Team, x: number = -1, y: number = -1) {
		this._type = type;
		this._team = team;
		this._id = Piece._nextId++;

		this.updatePosition(x, y);
	}

	public get type(): PieceType {
		return this._type;
	}
	public get team(): Team {
		return this._team;
	}
	public get x(): number {
		return this._x;
	}
	public get xletter(): string {
		return Piece.colToLetter(this._x);
	}
	public get y(): number {
		return this._y;
	}
	public get id(): number {
		return this._id;
	}

	public get notation(): 'K'|'Q'|'B'|'N'|'R'|'' {
		return Piece.notationFromType(this.type);
	}

	public toString(): string {
		return `${this.notation}(${Piece.colToLetter(this.x, true)}${this.y+1})`;
	}

	/**
	 * Utililized by the Board to update the stored position. Does not move the piece on the board.
	 */
	public updatePosition(x: number, y: number): void {
		if (x < -1 || x > 7 || y < -1 || y > 7)
			throw 'Piece position must be either on the board or (-1,-1) for off-board.';
		this._x = x;
		this._y = y;
	}

	public demote(): void {
		this._type = 'pawn';
	}

	public promote(type: PieceType): void {
		if (this._type !== 'pawn')
			throw 'Only pawns may be promoted.';
		if (type !== 'queen' && type !== 'bishop' && type !== 'knight'
			&& type !== 'rook' && type !== 'pawn')
			throw `Invalid promotion type.`;
		this._type = type;
	}

	public isTurnValid(turn: Turn, board: Board): boolean {
		// Pawns are the x-axis

		// TODO Make this abstract and have each piece implement this function
		// For example, rook's would check that either xi==xf or yi==yf, then check that all spaces along that axis of movement are unoccupied
		// OR, a big, ugly switch statement
		// Three main checks:
		// 1. Can the piece ever make that move
		// 2. Is the movement path unobstructed (except knights)
		// 3. Is final position occupied by friendly piece

		if (turn.type == 'invalid') return false; // Invalid move, just return false

		if (board.grid[turn.y2][turn.x2] != null && board.grid[turn.y2][turn.x2].team == turn.actor.team) return false; // Friendly piece in the way at destination

		let t = this._team;
		if (t == 'white') t = 'black'; // Find the which is the enemy team
		else t = 'white';

		board.applyTurn(turn); // Temporarily applying the turn
		let threats = board.getThreatenedSpaces(t); // Find which spaces the enemy team will threaten after the turn is applied
		for (let y = 0; y < 8; y++) { // Find the current team's king and check for check
			for (let x = 0; x < 8; x++) {
				if (board.grid[y][x] != null && board.grid[y][x].type == 'king' && board.grid[y][x].team == turn.actor.team && threats[y][x] == true) {
					BoardAPI.errorDesc = 'Cannot move king into check.';
					board.undoTurn(turn); // Undo the turn before erroring
					return false; // Current team's king put in check due to this move, therefore invalid
				}
			}
		}
		board.undoTurn(turn); // Undo the temporary turn

		let xdiff = Math.abs(turn.x2 - turn.x1);
		let ydiff = Math.abs(turn.y2 - turn.y1);
		let a: number, b: number, x: number, y: number;
		switch (turn.actor.type) {
			/* KING KING KING KING KING KING */
			case 'king':
				if (xdiff > 1 || ydiff > 1) { // Might be a castle, but not a normal king move
					if (ydiff != 0 || xdiff != 2) { // Not a castle, so invalid
						return false;
					} else {
						// Castling cannot occur if:
						//   1. The King is in check
						//   2. A space the King must cross or will arrive at is threatened
						//   3. The King or Rook to castle with has moved
						//   4. A piece, enemy or friendly, is obstructing the castling path

						let a: number; 
						if (turn.x1 < turn.x2) { // Determining which way the king is moving to check king transition space
							a = turn.x1 + 1; // Right
						} else {
							a = turn.x1 - 1; // Left
						}

						if (turn.actor.hasMoved == true || turn.actor2.hasMoved == true) return false; // King or rook has moved, cannot castle
						else if (threats[turn.y1][turn.x1] == true) return false; // King is in check, cannot castle
						else if (threats[turn.y1][turn.x2] == true) return false; // King's destination is threatened, cannot castle
						else if (threats[turn.y1][a] == true) return false; // King's transition space is threatened, cannot castle
						else return true;
					}
				} else { // Should be normal move, can't have pieces in the way, as this is a one-square move
					return true;
				}
			/* END KING */
			/* QUEEN QUEEN QUEEN QUEEN QUEEN QUEEN */
			case 'queen':
				if (xdiff == ydiff) { // Diagonal move
					let xminus: boolean;
					let yminus: boolean;
					if (turn.y1 < turn.y2) {
						yminus = false;
						a = turn.y1 + 1;
					} else {
						yminus = true;
						a = turn.y1 - 1;
					}
					if (turn.x1 < turn.x2) {
						xminus = false;
						x = turn.x1 + 1;
					} else {
						xminus = true;
						x = turn.x1 - 1;
					}
					b = turn.y2;
					while (a != b) { // Check spaces between source and destination
						if (board.grid[a][x] != null) return false; // Piece in the way
						// Move toward y and x destination
						if (yminus) a--;
						else a++;
						if (xminus) x--;
						else x++;
					}
				} else if (xdiff == 0) { // y-axis move
					if (turn.y1 < turn.y2) {
						a = turn.y1 + 1;
						b = turn.y2;
					} else {
						a = turn.y2 + 1;
						b = turn.y1;
					}
					x = turn.x1;
					while (a < b) { // Check spaces between source and destination
						if (board.grid[a][x] != null) return false; // Piece in the way
						a++; // Move toward destination/source
					}
				} else if (ydiff == 0) { // x-axis move
					if (turn.x1 < turn.x2) {
						a = turn.x1 + 1;
						b = turn.x2;
					} else {
						a = turn.x2 + 1;
						b = turn.x1;
					}
					y = turn.y1;
					while (a < b) { // Check spaces between source and destination
						if (board.grid[y][a] != null) return false; // Piece in the way
						a++; // Move toward destination/source
					}
				} else { // Invalid, xdiff and ydiff must equal or one must be 0
					return false;
				}
				return true;
			/* END QUEEN */
			/* BISHOP BISHOP BISHOP BISHOP BISHOP BISHOP */
			case 'bishop':
				if (xdiff == ydiff) {
					let xminus: boolean;
					let yminus: boolean;
					if (turn.y1 < turn.y2) {
						yminus = false;
						a = turn.y1 + 1;
					} else {
						yminus = true;
						a = turn.y1 - 1;
					}
					if (turn.x1 < turn.x2) {
						xminus = false;
						x = turn.x1 + 1;
					} else {
						xminus = true;
						x = turn.x1 - 1;
					}
					b = turn.y2;
					while (a != b) { // Check spaces between source and destination
						if (board.grid[a][x] != null) return false; // Piece in the way
						// Move toward y and x destination
						if (yminus) a--;
						else a++;
						if (xminus) x--;
						else x++;
					}
				} else { // Invalid, xdiff and ydiff must be equal
					return false;
				}
				return true;
			/* END BISHOP */
			/* KNIGHT KNIGHT KNIGHT KNIGHT KNIGHT KNIGHT */
			case 'knight':
				if (xdiff == 2 && ydiff == 1 || xdiff == 1 && ydiff == 2) { // L move
					return true;
				} else { // Not an L move
					return false;
				}
			/* END KNIGHT */
			/* ROOK ROOK ROOK ROOK ROOK ROOK */
			case 'rook':
				if (xdiff == 0) { // y-axis move
					if (turn.y1 < turn.y2) {
						a = turn.y1 + 1;
						b = turn.y2;
					} else {
						a = turn.y2 + 1;
						b = turn.y1;
					}
					x = turn.x1;
					while (a < b) { // Check spaces between source and destination
						if (board.grid[a][x] != null) return false; // Piece in the way
						a++; // Move toward destination/source
					}
				} else if (ydiff == 0) { // x-axis move
					if (turn.x1 < turn.x2) {
						a = turn.x1 + 1;
						b = turn.x2;
					} else {
						a = turn.x2 + 1;
						b = turn.x1;
					}
					y = turn.y1;
					while (a < b) { // Check spaces between source and destination
						if (board.grid[y][a] != null) return false; // Piece in the way
						a++; // Move toward destination/source
					}
				} else { // Invalid, either xdiff or ydiff must be 0
					return false;
				}
				return true;
			/* END ROOK */
			/* PAWN PAWN PAWN PAWN PAWN PAWN */
			case 'pawn':
				let pawnMovement = turn.y2 - turn.y1;
				if (xdiff == 1 && ydiff == 1) { // Pawn diagonal attack
					let dest = board.grid[turn.y2][turn.x2];
					let offset: number;
					if (turn.actor.team == 'white') offset = -1; // Behind white pawn
					else offset = 1; // Behind black pawn
					let behindPawn = board.grid[turn.y2 + offset][turn.x2]
					if (dest == null && behindPawn == null) {
						return false; // Not an enpassant and no enemy piece to take at pawn destination
					} else { // Piece present at pawn attack destination or behind that destination
						if (dest != null) { // Normal pawn attack
							return true; // Enemy piece at destination
						} else { // A piece is behind the pawn attack destination
							if (behindPawn.type != 'pawn' || behindPawn.team == turn.actor.team) return false;
							else return true; // Valid enpassant
						}
					}
				} else if (ydiff == 1 && xdiff == 0) { // Pawn single move
					if (turn.actor.team == 'white' && (pawnMovement < 1) || turn.actor.team == 'black' && (pawnMovement > -1)) {
						return false; // Pawn moving backwards
					} else if (board.grid[turn.y2][turn.x2] != null) {
						return false; // Piece in the way at pawn destination
					} else return true; // Valid single move
				} else if (ydiff == 2 && xdiff == 0 && this.hasMoved == false) { // Pawn double move allowed if it hasn't moved
					if (board.grid[turn.y2][turn.x2] != null) return false; // Piece in the way at pawn destination
					if (turn.actor.team == 'white') {
						y = turn.y1 + 1; // White team pawn double move transition space
					} else if (turn.actor.team == 'black') {
						y = turn.y1 - 1; // Black team pawn double move transition space
					}
					if (board.grid[y][turn.x2] != null) return false; // Obstruction check for pawn double move transition space
					else return true; // Valid double move
				} else {
					return false;
				}

			/* END PAWN */
			/* DEFAULT DEFAULT DEFAULT DEFAULT DEFAULT DEFAULT */
			default:
				return false;
		}
	}

	/**
	 * Get all valid moves that the piece could make. 
	 */
	public getPossibleTurns(board: Board): Turn[] {
		let turns: Turn[] = [];

		/* Thoughts on moves explicity not covered: 
		 * En passant will happen even when not possible, but fine since validity is checked later.
		 * Pawn promotion will never affect the current turn, just the next turn. 
		 * Cannot castle out of check
		 * Can always move instead of castling
		 */

		// Calculate all theoretically possible moves
		switch (this.type) {
			case 'king': // Any direction, 1 cell
				for (let y = Math.max(this.y-1, 0); y < Math.min(this.y+1, 8); y++)
					for (let x = Math.max(this.x-1, 0); x < Math.min(this.x+1, 8); x++)
						turns.push(Turn.newAndInit(this, x, y, board));
				break;
			case 'queen': // Any direction, 7 cells, stop at first occupied
				// Right
				for (let x = this.x+1; x <= 7; x++) {
					turns.push(Turn.newAndInit(this, x, this.y, board));
					if (board.grid[this.y][x] !== null)
						break;
				}
				// Left
				for (let x = this.x-1; x >= 0; x--) {
					turns.push(Turn.newAndInit(this, x, this.y, board));
					if (board.grid[this.y][x] !== null)
						break;
				}
				// Up
				for (let y = this.y+1; y <= 7; y++) {
					turns.push(Turn.newAndInit(this, this.x, y, board));
					if (board.grid[y][this.x] !== null)
						break;
				}
				// Down
				for (let y = this.y-1; y >= 0; y--) {
					turns.push(Turn.newAndInit(this, this.x, y, board));
					if (board.grid[y][this.x] !== null)
						break;
				}
			case 'bishop': // Diagonal, 7 cells, stop at first occupied
				// Up-right
				for (let d = 1; d < 8; d++) {
					if (this.x + d > 7 || this.y + d > 7)
						break;
					turns.push(Turn.newAndInit(this, this.x + d, this.y + d, board));
					if (board.grid[this.y + d][this.x + d] !== null)
						break;
				}
				// Down-right
				for (let d = 1; d < 8; d++) {
					if (this.x + d > 7 || this.y - d < 0)
						break;
					turns.push(Turn.newAndInit(this, this.x + d, this.y - d, board));
					if (board.grid[this.y - d][this.x + d] !== null)
						break;
				}
				// Up-left
				for (let d = 1; d < 8; d++) {
					if (this.x - d < 0 || this.y + d > 7)
						break;
					turns.push(Turn.newAndInit(this, this.x - d, this.y + d, board));
					if (board.grid[this.y + d][this.x - d] !== null)
						break;
				}
				// Down-left
				for (let d = 1; d < 8; d++) {
					if (this.x - d < 0 || this.y - d < 0)
						break;
					turns.push(Turn.newAndInit(this, this.x - d, this.y - d, board));
					if (board.grid[this.y - d][this.x - d] !== null)
						break;
				}
				break;
			case 'rook': // Straight, 7 cells, stop at first occupied
				// Right
				for (let x = this.x+1; x <= 7; x++) {
					turns.push(Turn.newAndInit(this, x, this.y, board));
					if (board.grid[this.y][x] !== null)
						break;
				}
				// Left
				for (let x = this.x-1; x >= 0; x--) {
					turns.push(Turn.newAndInit(this, x, this.y, board));
					if (board.grid[this.y][x] !== null)
						break;
				}
				// Up
				for (let y = this.y+1; y <= 7; y++) {
					turns.push(Turn.newAndInit(this, this.x, y, board));
					if (board.grid[y][this.x] !== null)
						break;
				}
				// Down
				for (let y = this.y-1; y >= 0; y--) {
					turns.push(Turn.newAndInit(this, this.x, y, board));
					if (board.grid[y][this.x] !== null)
						break;
				}
				break;
			case 'knight': // L-shape
				turns.push(Turn.newAndInit(this, this.x + 1, this.y + 2, board));
				turns.push(Turn.newAndInit(this, this.x + 2, this.y + 1, board));
				turns.push(Turn.newAndInit(this, this.x - 1, this.y + 2, board));
				turns.push(Turn.newAndInit(this, this.x - 2, this.y + 1, board));
				turns.push(Turn.newAndInit(this, this.x - 1, this.y - 2, board));
				turns.push(Turn.newAndInit(this, this.x - 2, this.y - 1, board));
				turns.push(Turn.newAndInit(this, this.x + 1, this.y - 2, board));
				turns.push(Turn.newAndInit(this, this.x + 2, this.y - 1, board));
				break;
			case 'pawn': // Forward or diagonal, 1 cell
				if (this.team === 'white') {
					turns.push(Turn.newAndInit(this, this.x, this.y + 1, board));
					turns.push(Turn.newAndInit(this, this.x, this.y + 2, board));
					turns.push(Turn.newAndInit(this, this.x - 1, this.y + 1, board));
					turns.push(Turn.newAndInit(this, this.x + 1, this.y + 1, board));
				}
				else if (this.team === 'black') {
					turns.push(Turn.newAndInit(this, this.x, this.y - 1, board));
					turns.push(Turn.newAndInit(this, this.x, this.y - 2, board));
					turns.push(Turn.newAndInit(this, this.x - 1, this.y - 1, board));
					turns.push(Turn.newAndInit(this, this.x + 1, this.y - 1, board));
				}
				break;
		}

		// Remove moves onto friendly pieces
		for (let t = 0; t < turns.length; t++)
			if (turns[t] === null || (turns[t].type === 'take' && turns[t].target.team === this.team) || !turns[t].isValid(board))
				turns.splice(t--, 1);

		return turns;
	}

	/**
	 * Remove the piece's functions, getters, and setters in preparation for stringification.
	 */
	public serialize(): PieceSerialized {
		return {
			type: this.type,
			team: this.team,
			x: this.x,
			y: this.y,
			id: this.id
		};
	}

	/**
	 * Keep only needed information for detecting moves at runtime.
	 */
	public minimize(): PieceMinimal {
		return {
			type: this.type,
			team: this.team
		};
	}
}

interface Move {
	x: number;
	y: number;
}

export interface PieceSerialized {
  type: string,
  team: string,
  x: number,
  y: number,
  id: number
}

export interface PieceMinimal {
	type: PieceType,
	team: Team
}
