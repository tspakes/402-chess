import { Piece, PieceType, PieceSerialized } from "./Piece";
import { Board } from "./Board";

export type TurnType = 'move'|'take'|'castle'|'enpassant'|'pawnpromotion'|'invalid';

export class Turn {
  public type: TurnType;

  public x1: number = -1; // Actor initial
  public y1: number = -1;
  public x2: number = -1; // Actor final
  public y2: number = -1;
  public x3: number = -1; // Actor2 initial
  public y3: number = -1;
  public x4: number = -1; // Actor2 final
  public y4: number = -1;

  private _actor: Piece = null; // Piece moving
  private _actor2: Piece = null; // Only used for castling
  public target: Piece = null; // Used in take, enpassant, and pawnpromotion

  public promotion: PieceType;
  public check: ''|'check'|'checkmate' = '';
  public meta: any = {}; // Pawn double move, castle side

  // All of this is to maintain the positions apart from the references as the pieces will change over time
  public get actor(): Piece {
    return this._actor;
  }
  public get actor2(): Piece {
    return this._actor2;
  }
  public set actor(p: Piece) {
    this._actor = p;
    this.x1 = p.x;
    this.y1 = p.y;
  }
  public set actor2(p: Piece) {
    this._actor2 = p;
    this.x3 = p.x;
    this.y3 = p.y;
  }

	/**
	 * @see http://blog.chesshouse.com/how-to-read-and-write-algebraic-chess-notation/
   * @see https://en.wikipedia.org/wiki/Algebraic_notation_(chess)
	 */
	public get notation(): string {
    let not: string = '';

    // Base notation
    switch (this.type) {
      case 'castle':
        not = this.meta.kingside ? 'O-O' : 'O-O-O';
        break;
      case 'take': // Include type, source, x, and destination
        not = 'x' + Piece.colToLetter(this.x2) + (this.y2 + 1);
      case 'enpassant': // Include file of departure
        not = Piece.colToLetter(this.x1) + not;
        break;
      case 'pawnpromotion':
        not += Piece.colToLetter(this.x2) + (this.y2 + 1) + '=' + Piece.notationFromType(this.promotion);
        break;
      default:
        not = Piece.colToLetter(this.x2) + (this.y2 + 1);
    }

    // TODO Actor disambiguation

    // Prefixes
    if (this.type === 'take' || this.type === 'enpassant') not = this.actor.notation + not;

    // Suffixes
    if (this.type === 'enpassant') not += '(ep)';
    if (this.check === 'check') not += '+';
    if (this.check === 'checkmate') not += '++';

    return not;
  }

	public isValid(board: Board): boolean {
    if (this.type == 'enpassant' && board.lastTurn != null && this.target != board.lastTurn.actor && board.lastTurn.meta.doublepawn != true) {
      return false; // Attempted invalid enpassant
    } 
    // TODO This should handle castling while Piece.isTurnValid() just checks that each piece moved in a valid way
    //      For castling, check that both king and rook castled to the same side
    // TODO Need to check that this.actor2.isTurnValid() as well, but it'll need to use a different x and y, so maybe pass in the x and y instead?
    
    let valid: boolean = this.type !== 'invalid';

    if (this.type === 'pawnpromotion') // Treat actor as pawn still on the promotion move
      this.actor.demote();
    valid = this.actor.isTurnValid(this, board);
    if (this.type === 'pawnpromotion')
      this.actor.promote(this.promotion);

    return valid;
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
      target: this.target ? this.target.serialize() : null,
      promotion: this.promotion,
      notation: this.notation,
      meta: this.meta
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
  meta: {};
}