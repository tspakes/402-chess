import { Piece, PieceType, PieceSerialized } from "./Piece";

export type TurnType = 'move'|'take'|'castle'|'enpassant'|'pawnpromotion';

export class Turn {
	public type: TurnType;
	public x1: number;
	public y1: number;
	public x2: number;
	public y2: number;
	public actor: Piece; // Piece moving
  public target: Piece; // Used in take, enpassant, and pawnpromotion
	public promotion: PieceType;
	// TODO Pawn promotion might also be a take, enpassant is always a take
	// Probably just type enpassant as move and take, only differentiate upon checking validity

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