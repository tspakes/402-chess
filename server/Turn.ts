import { Piece, PieceType, PieceSerialized } from "./Piece";
import { Board } from "./Board";

export type TurnType = 'move'|'take'|'castle'|'castlekingside'|'castlequeenside'|'enpassant'|'pawnpromotion'|'invalid';

export class Turn {
  public type: TurnType;
  private _x2: number = -1;
  private _y2: number = -1;
	public actor: Piece = null; // Piece moving
  public target: Piece = null; // Used in take, enpassant, and pawnpromotion
  public promotion: PieceType;
  public lastTurn: Turn;
	// TODO Pawn promotion might also be a take, enpassant is always a take
  // Probably just type enpassant as move and take, only differentiate upon checking validity
  
  public get x1(): number {
    if (!this.actor) return -1;
    return this.actor.x;
  }
  public get y1(): number {
    if (!this.actor) return -1;
    return this.actor.y;
  }
  public get x2(): number {
    if (this._x2 >= 0) return this._x2;
    if (!this.target) return -1;
    return this.target.x;
  }
  public set x2(value: number) {
    this._x2 = value;
  }
  public get y2(): number {
    if (this._x2 >= 0) return this._y2;
    if (!this.target) return -1;
    return this.target.y;
  }
  public set y2(value: number) {
    this._y2 = value;
  }

	/**
	 * @see http://blog.chesshouse.com/how-to-read-and-write-algebraic-chess-notation/
	 */
	public get notation(): string {
		// TODO Append '+' for check and '++' for checkmate.
		// Seems like chess notation is chosen to be as short as possible while still being fully explicit,
		//  so certain if the only one piece could've taken another, you only designate the attacking piece
		//  followed by the target's position. 
		// Really going to need move validity checking before this can be fully fleshed out. 
		if ('castle')
			return 'Not yet implemented.'; // Castling kingside is 'O-O' and queenside is 'O-O-O'
		if ('enpassant')
			return 'Not yet implemented.'; // Include extra '(ep)' at end but I'm assuming before '+' for check if applicable
		if ('pawnpromotion')
			return 'Not yet implemented.'; // Include '=' followed by notation for piece promoted to, e.g. '=Q'
		if ('take')
			return 'Not yet implemented.'; // Include type, x, source, and destination
		return this.actor.notation + String.fromCharCode(97/*a*/ + this.x2) + (this.y2 + 1);
  }

	public isValid(board: Board): boolean {
    if (this.type == 'enpassant' && this.target != board.lastTurn.actor && lastTurn.meta.doublepawn != true) return false; // Attempted invalid enpassant 
    return this.type !== 'invalid' && this.actor.isTurnValid(this, board);
    
	}
  
  /**
   * Remove the turn's functions, getters, and setters in preparation for stringification. 
   */
  public serialize(): TurnSerialized {
    return {
      type: this.type,
      x1: this.x1,
      y1: this.y1,
      x2: this.x2,
      y2: this.y2,
      actor: this.actor.serialize(),
      target: this.target.serialize(),
      promotion: this.promotion,
      notation: this.notation
    }
  }
}

export interface TurnSerialized {
  type: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  actor: PieceSerialized;
  target: PieceSerialized;
  promotion: string;
  notation: string;
}