import { Piece, PieceType, PieceSerialized } from "./Piece";
import { Board } from "./Board";

export type TurnType = 'move'|'take'|'castle'|'enpassant'|'pawnpromotion'|'invalid';
export type CheckType = ''|'check'|'checkmate'|'stalemate';

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

  private _notation: string = '';

  private _actor: Piece = null; // Piece moving
  private _actor2: Piece = null; // Only used for castling
  public target: Piece = null; // Used in take, enpassant, and pawnpromotion

  public promotion: PieceType;
  public check: CheckType = '';
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
    return this._notation;
  }

  public generateNotation(board: Board): void {
    let not: string = '';

    // Get all pieces of matching type to current piece
    // For each of those pieces, get all possible moves - will give turn objects
    // If any of those turns have identical x2, y2 s, add to an array
    // Break the inner loop to go to the next piece
    // Outside of the loops, look at the pieces in that array and find the distinct movement vector (x or y)
    //   differing col, two bishops: B3e5

    // Actor disambiguation
    let piecesOfSameType = board.getMatchingPieces(this.actor.team, [this.actor.type])

    let turns: Turn[] = [];
    let conflictTurn: Turn = null;
    conflictCheck:
    for (let a = 0; a < piecesOfSameType.length; a++) {
      turns = piecesOfSameType[a].getPossibleTurns(board);
      for (let b = 0; b < turns.length; b++) {
        if (this != turns[b] && this.x2 == turns[b].x2 && this.y2 == turns[b].y2) {
          conflictTurn = turns[b];
          break conflictCheck;
        }
      }
    }

    if (conflictTurn !== null) {
      let rowOrCol: string;
      if (this.x1 == conflictTurn.x1) { // Same column
        rowOrCol = (this.y1 + 1).toString();
      } else { // Same row
        rowOrCol = Piece.colToLetter(this.x1);
      }
      not = this.actor.notation + rowOrCol;
    } else {
      not = this.actor.notation;
    }


    // Base notation
    switch (this.type) {
      case 'castle':
        not = this.meta.kingside ? 'O-O' : 'O-O-O';
        break;
      case 'take': // Include type, source, x, and destination
        not = not + 'x' + Piece.colToLetter(this.x2) + (this.y2 + 1);
        break;
      case 'enpassant': // Include file of departure
        not = Piece.colToLetter(this.x1) + 'x' + Piece.colToLetter(this.x2) + (this.y2 + 1) + 'e.p.';
        break;
      case 'pawnpromotion':
        not = not + Piece.colToLetter(this.x2) + (this.y2 + 1) + '=' + Piece.notationFromType(this.promotion);
        break;
      default:
        not = not + Piece.colToLetter(this.x2) + (this.y2 + 1);
    }

    // Suffixes
    if (this.check === 'check') not += '+';
    if (this.check === 'checkmate') not += '++';
    if (this.check === 'stalemate') not += '+++';

    this._notation = not;
  }

  /**
   * Create and partially initialize a turn object. Does not fully qualify or validate the turn.
   * @returns Partially initialized Turn object
   */
  public static newAndInit(actor: Piece, x2: number, y2: number, board: Board): Turn {
    if (x2 < 0 || x2 > 7 || y2 < 0 || y2 > 7)
      return null;
    let t = new Turn();
    t.actor = actor;
    t.x2 = x2;
    t.y2 = y2;
    t.type = 'move';
    if (board.grid[y2][x2] !== null) {
      t.target = board.grid[y2][x2];
      t.type = 'take';
    }
    return t;
  }

	public isValid(board: Board): boolean {
    if (this.type == 'enpassant' && this.target != board.lastTurn.actor && board.lastTurn.meta.doublepawn != true)
      return false; // Attempted invalid enpassant
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
      check: this.check,
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
  check: CheckType;
  promotion: string;
  notation: string;
  meta: {};
}