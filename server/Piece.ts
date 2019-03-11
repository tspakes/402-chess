import { Board } from "./Board";

export type PieceType = 'king'|'queen'|'bishop'|'knight'|'rook'|'pawn'|'unknown';
export type Team = 'black'|'white'|'unknown';

export class Piece {

	private _type: PieceType;
	private _team: Team;
	private _x: number;
  private _y: number;

	constructor(type: PieceType, team: Team, x: number = -1, y: number = -1) {
    this._type = type;
    this._team = team;
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
  public get y(): number {
    return this._y;
  }

	public get notation(): 'K'|'Q'|'B'|'N'|'R'|'' {
		switch (this.type) {
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

  public toString(): string {
    return `${this.notation}(${String.fromCharCode(65+this.x)}${this.y+1})`;
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

		let xdiff = Math.abs(turn.x2 - turn.x1);
		let ydiff = Math.abs(turn.y2 - turn.y1);
		switch (turn.type) {
	/* KING KING KING KING KING KING */
			case 'king':
				// Have to consider moves not being able to be made due to check threat
				if (xdiff > 1 || ydiff > 1) { // Might be a castle, but not a normal king move
					if (ydiff != 0 || xdiff != 2) { //Not a castle, so invalid
						return false;
					} else {
						// Castling cannot occur if:
						//   1. The King is in check
						//   2. A space the King must cross or will arrive at is threatened
						//   3. The King or Rook to castle with has moved
						//   4. A piece, enemy or friendly, is obstructing the castling path
					}
				} else { // Should be normal move, can't have pieces in the way, as this is a one-square move
					return true;
				}
	/* END KING */
	/* QUEEN QUEEN QUEEN QUEEN QUEEN QUEEN */
			case 'queen':
				if (xdiff == ydiff) { // Diagonal move
					if (turn.y1 < turn.y2) {
						let a = turn.y1 + 1;
						let b = turn.y2;
					} else {
						let a = turn.y2 + 1;
						let b = turn.y1;
					}
					if (turn.x1 < turn.x2) {
						let x = x1 + 1;
					} else {
						let x = x2 + 1;
					}
					while (a < b) { // Check spaces between source and destination
						if (board.grid[a][x] != null) return false; // Piece in the way
						a++; // Move toward y destination/source
						x++; // Move toward x destination/source
					}
				} else if (xdiff == 0) { // y-axis move
					if (turn.y1 < turn.y2) {
						let a = turn.y1 + 1;
						let b = turn.y2;
					} else {
						let a = turn.y2 + 1;
						let b = turn.y1;
					}
					let x = turn.x1;
					while (a < b) { // Check spaces between source and destination
						if (board.grid[a][x] != null) return false; // Piece in the way
						a++; // Move toward destination/source
					}
				} else if (ydiff == 0) { // x-axis move
					if (turn.x1 < turn.x2) {
						let a = turn.x1 + 1;
						let b = turn.x2;
					} else {
						let a = turn.x2 + 1;
						let b = turn.x1;
					}
					let y = turn.y1;
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
					let a = turn.y1 + 1;
					let b = turn.y2;
				} else {
					let a = turn.y2 + 1;
					let b = turn.y1;
				}
				if (turn.x1 < turn.x2) {
					let x = x1 + 1;
				} else {
					let x = x2 + 1;
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
					let a = turn.y1 + 1;
					let b = turn.y2;
				} else {
					let a = turn.y2 + 1;
					let b = turn.y1;
				}
				let x = turn.x1;
				while (a < b) { // Check spaces between source and destination
					if (board.grid[a][x] != null) return false; // Piece in the way
					a++; // Move toward destination/source
				}
			} else if (ydiff == 0) { // x-axis move
				if (turn.x1 < turn.x2) {
					let a = turn.x1 + 1;
					let b = turn.x2;
				} else {
					let a = turn.x2 + 1;
					let b = turn.x1;
				}
				let y = turn.y1;
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
				return true;
	/* END PAWN */
	/* DEFAULT DEFAULT DEFAULT DEFAULT DEFAULT DEFAULT */
			default:
				return false;
				// Do something errory
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
      y: this.y
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
	y: number
}

export interface PieceMinimal {
  type: PieceType,
  team: Team
}
