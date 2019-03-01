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

  public checkMoveValid(xi: number, yi: number, xf: number, yf: number, board: Board): void {
    // TODO Make this abstract and have each piece implement this function
    // For example, rook's would check that either xi==xf or yi==yf, then check that all spaces along that axis of movement are unoccupied
    // OR, a big, ugly switch statement
    // Three main checks:
    // 1. Can the piece ever make that move
    // 2. Is the movement path unobstructed (except knights)
    // 3. Is final position occupied by friendly piece
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