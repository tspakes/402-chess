import { Board } from "./Board";
import { Turn } from "./Turn";

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

		let xdiff = Math.abs(turn.x2 - turn.x1);
		let ydiff = Math.abs(turn.y2 - turn.y1);
		let a: number, b: number, x: number, y: number; // <- Just added temporarily to fix build errors
		switch (turn.actor.type) {
			/* KING KING KING KING KING KING */
			case 'king':
				// Have to consider moves not being able to be made due to check threat
				if (xdiff > 1 || ydiff > 1) { // Might be a castle, but not a normal king move
					if (ydiff != 0 || xdiff != 2) { // Not a castle, so invalid
						return false;
					} else {
						// Castling cannot occur if:
						//   1. The King is in check
						//   2. A space the King must cross or will arrive at is threatened
						//   3. The King or Rook to castle with has moved
						//   4. A piece, enemy or friendly, is obstructing the castling path

						return true;
					}
				} else { // Should be normal move, can't have pieces in the way, as this is a one-square move
					return true;
				}
			/* END KING */
			/* QUEEN QUEEN QUEEN QUEEN QUEEN QUEEN */
			case 'queen':
				if (xdiff == ydiff) { // Diagonal move
					if (turn.y1 < turn.y2) {
						a = turn.y1 + 1;
						b = turn.y2;
					} else {
						a = turn.y2 + 1;
						b = turn.y1;
					}
					if (turn.x1 < turn.x2) {
						x = turn.x1 + 1;
					} else {
						x = turn.x2 + 1;
					}
					while (a < b) { // Check spaces between source and destination
						if (board.grid[a][x] != null) return false; // Piece in the way
						a++; // Move toward y destination/source
						x++; // Move toward x destination/source
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
					if (turn.y1 < turn.y2) {
						a = turn.y1 + 1;
						b = turn.y2;
					} else {
						a = turn.y2 + 1;
						b = turn.y1;
					}
					if (turn.x1 < turn.x2) {
						x = turn.x1 + 1;
					} else {
						x = turn.x2 + 1;
					}
					while (a < b) { // Check spaces between source and destination
						if (board.grid[a][x] != null) return false; // Piece in the way
						a++; // Move toward y destination/source
						x++; // Move toward x destination/source
					}
				} else {// Invalid, xdiff and ydiff must be equal
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
