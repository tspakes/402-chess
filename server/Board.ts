import { Piece, PieceSerialized, PieceType, Team, PieceMinimal } from "./Piece";
import { Turn } from "./Turn";
import Chalk from 'chalk';

export class Board { // Single state of the board
  public lastTurn: Turn;
  public grid: Piece[][]; // Rows denoted by numbers, columns by letters A-H (y, x here)
  /* Notation: display/internal, ███'s are black squares
   *     A/0 B/1 C/2 D/3 E/4 F/5 G/6 H/7
   * 8/7 ╬╬╬ ███ ╬╬╬ ███ ╬╬╬ ███ ╬╬╬ ███
   * 7/6 ███ ╬╬╬ ███ ╬╬╬ ███ ╬╬╬ ███ ╬╬╬
   * 6/5 ╬╬╬ ███ ╬╬╬ ███ ╬╬╬ ███ ╬╬╬ ███
   * 5/4 ███ ╬╬╬ ███ ╬╬╬ ███ ╬╬╬ ███ ╬╬╬
   * 4/3 ╬╬╬ ███ ╬╬╬ ███ ╬╬╬ ███ ╬╬╬ ███
   * 3/2 ███ ╬╬╬ ███ ╬╬╬ ███ ╬╬╬ ███ ╬╬╬
   * 2/1 ╬╬╬ ███ ╬╬╬ ███ ╬╬╬ ███ ╬╬╬ ███
   * 1/0 ███ ╬╬╬ ███ ╬╬╬ ███ ╬╬╬ ███ ╬╬╬
   */

  /**
   * Board is completely empty when constructed. 
   */
	constructor() {
		this.grid = [];
		for (let y = 0; y < 8; y++) {
			this.grid[y] = [];
      for (let x = 0; x < 8; x++)
        this.grid[y].push(null);
		}
	}

	public get pieces(): Piece[] {
		let list = [];
		for (let column of this.grid)
			for (let piece of column)
				list.push(piece);
		return list;
  }
  
  /**
   * Set up the board with all 32 pieces in their starting positions. 
   */
  public initPieces(): void {
    // Black (higher indexes)
    this.placePiece('rook', 'black', 0, 7);
    this.placePiece('knight', 'black', 1, 7);
    this.placePiece('bishop', 'black', 2, 7);
    this.placePiece('queen', 'black', 3, 7);
    this.placePiece('king', 'black', 4, 7);
    this.placePiece('bishop', 'black', 5, 7);
    this.placePiece('knight', 'black', 6, 7);
    this.placePiece('rook', 'black', 7, 7);
    for (let x = 0; x < 8; x++)
      this.placePiece('pawn', 'black', x, 6);

    // White (lower indexes)
    for (let x = 0; x < 8; x++)
      this.placePiece('pawn', 'white', x, 1);
    this.placePiece('rook', 'white', 0, 0);
    this.placePiece('knight', 'white', 1, 0);
    this.placePiece('bishop', 'white', 2, 0);
    this.placePiece('queen', 'white', 3, 0);
    this.placePiece('king', 'white', 4, 0);
    this.placePiece('bishop', 'white', 5, 0);
    this.placePiece('knight', 'white', 6, 0);
    this.placePiece('rook', 'white', 7, 0);
  }

	public placePiece(type: PieceType, team: Team, x: number, y: number): void {
    let p = new Piece(type, team, x, y);
    this.grid[y][x] = p;
  }
  
  public toString(): string {
    let str: string = Chalk.gray('  A B C D E F G H\n');
    for (let y = 7; y >= 0; y--) {
      str += Chalk.gray(`${y+1} `); // Row demarkation
      for (let x = 0; x < 8; x++) {
        // Piece '-' for empty, 'P' for pawn, notation for others; cyan for white, blue for black
        if (this.grid[y][x] === null) str += Chalk.gray('-');
        else {
          if (this.grid[y][x].team === 'white')
            str += Chalk.cyanBright(this.grid[y][x].notation === '' ? 'P' : this.grid[y][x].notation);
          else
            str += Chalk.blue(this.grid[y][x].notation === '' ? 'P' : this.grid[y][x].notation);
        }
        str += ' ';
      }
      str = str.slice(0, str.length-1) + '\n';
    }
    return str.slice(0, str.length-1);
  }

	public applyTurn(turn: Turn): void {
    if (turn.type === 'invalid') throw 'Could not apply invalid move to the board.';

    // Update board
    this.grid[turn.y1][turn.x1] = null;
    if (turn.type === 'enpassant')
      this.grid[turn.target.y][turn.target.x] = null;
    this.grid[turn.y2][turn.x2] = turn.actor;
    if (turn.type === 'castle') {
      this.grid[turn.y3][turn.x3] = null;
      this.grid[turn.y4][turn.x4] = turn.actor2;
    }

    // Update piece
    turn.actor.updatePosition(turn.x2, turn.y2);
    turn.actor.hasMoved = true;
    if (turn.type === 'castle')
      turn.actor2.updatePosition(turn.x4, turn.y4);
    // Don't need to handle turn.actor2.hasMoved because it will never be involved w/ en passant
    this.lastTurn = turn; 
  }

  public undoTurn(turn: Turn): void {
    if (turn.type === 'invalid') throw 'Could not apply invalid move to the board.';

    // Update board
    this.grid[turn.y2][turn.x2] = null;
    this.grid[turn.y1][turn.x1] = turn.actor;
    // Assuming that the target cannot be modified after being removed, place it in its
    //  previous position which may or may not be turn.x2,y2
    if (turn.target)
      this.grid[turn.target.y][turn.target.x] = turn.target;
    if (turn.type === 'castle') {
      this.grid[turn.y4][turn.x4] = null;
      this.grid[turn.y3][turn.x3] = turn.actor2;
    }

    // Update piece
    turn.actor.updatePosition(turn.x1, turn.y1);
    if (turn.meta.firstMove)
      turn.actor.hasMoved = false;
    if (turn.type === 'castle')
      turn.actor2.updatePosition(turn.x3, turn.y3);
    // Note that this.lastTurn is updated in BoardAPI.postUndo()
  }
  
  // Check which board spaces are threatened - this is for castling and king movement/check checking
  public getThreatenedSpaces(curTeam: Team, turnToApply: Turn = null): boolean[][] {
    if (turnToApply == null) { // Pre-state
      for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
          let piece = this.grid[y][x];
          if (piece != null && piece.team == curTeam) { // Piece found
            if (piece.type == 'king') {
              

            } else if (piece.type == 'queen') {

            } else if (piece.type == 'bishop') {

            } else if (piece.type == 'knight') {

            } else if (piece.type == 'rook') {

            } else if (piece.type == 'pawn') {

            } else { // Leftover piece type - shouldn't be reached

            }
          } else { // No piece of desired team or no piece
            
          }
        }
      }
    } else { // Post-state

    }
  }
  
  /**
   * Remove the board's functions, getters, and setters in preparation for stringification. 
   */
  public serialize(): PieceSerialized[][] {
    let ser = [];
    for (let y = 0; y < 8; y++) {
      ser[y] = [];
      for (let x = 0; x < 8; x++)
        ser[y].push(this.grid[y][x] ? this.grid[y][x].serialize() : null);
    }
    return ser;
  }

  /**
   * Keep only needed information for detecting moves at runtime. 
   */
  public minimize(): PieceMinimal[][] {
    let min = [];
    for (let y = 0; y < 8; y++) {
      min[y] = [];
      for (let x = 0; x < 8; x++)
        min[y].push(this.grid[y][x] ? this.grid[y][x].minimize() : null);
    }
    return min;
  }
}