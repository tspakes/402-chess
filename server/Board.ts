import { Piece, PieceSerialized, PieceType, Team, PieceMinimal } from "./Piece";
import { Turn } from "./Turn";

export class Board { // Single state of the board
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

	/**
	 * @returns true if valid, false if invalid
	 */
	public applyTurn(turn: Turn): boolean {
    // Check move validity
    if (turn.type === 'invalid') return false;
    //if (invalid) return false;

    // Update board
    this.grid[turn.y1][turn.x1] = null;
    this.grid[turn.y2][turn.x2] = turn.actor;

    // Update piece
    turn.actor.updatePosition(turn.x2, turn.y2);
    
		return true;
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